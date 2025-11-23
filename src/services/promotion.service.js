import { Promotion, PromotionItem, Product, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

class PromotionService {
  // Obtener todas las promociones
  async getAll() {
    try {
      const promotions = await Promotion.findAll({
        include: [{
          model: PromotionItem,
          as: 'promotionItems',
          include: [{
            model: Product,
            as: 'product'
          }]
        }],
        order: [['CreatedAt', 'DESC']]
      });
      return { success: true, data: promotions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener promociones activas
  async getActive() {
    try {
      const now = new Date();
      const promotions = await Promotion.findAll({
        where: {
          IsActive: true,
          [Op.and]: [
            {
              [Op.or]: [
                { StartDate: null },
                { StartDate: { [Op.lte]: now } }
              ]
            },
            {
              [Op.or]: [
                { EndDate: null },
                { EndDate: { [Op.gte]: now } }
              ]
            }
          ]
        },
        include: [{
          model: PromotionItem,
          as: 'promotionItems',
          include: [{
            model: Product,
            as: 'product'
          }]
        }],
        order: [['CreatedAt', 'DESC']]
      });
      return { success: true, data: promotions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener una promoción por ID
  async getById(id) {
    try {
      const promotion = await Promotion.findByPk(id, {
        include: [{
          model: PromotionItem,
          as: 'promotionItems',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });
      if (!promotion) {
        return { success: false, error: 'Promoción no encontrada', status: 404 };
      }
      return { success: true, data: promotion };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Validar si una promoción está disponible (activa y en fecha)
  async validatePromotionAvailability(promotionId) {
    try {
      const promotion = await Promotion.findByPk(promotionId, {
        include: [{
          model: PromotionItem,
          as: 'promotionItems',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      if (!promotion) {
        return { success: false, error: 'Promoción no encontrada' };
      }

      if (!promotion.IsActive) {
        return { success: false, error: 'La promoción no está activa' };
      }

      const now = new Date();
      if (promotion.StartDate && new Date(promotion.StartDate) > now) {
        return { success: false, error: 'La promoción aún no ha comenzado' };
      }

      if (promotion.EndDate && new Date(promotion.EndDate) < now) {
        return { success: false, error: 'La promoción ha expirado' };
      }

      // Validar stock de todos los productos de la promoción
      for (const item of promotion.promotionItems) {
        if (!item.product) {
          return { success: false, error: `Producto con ID ${item.ProductId} no encontrado` };
        }
        if (item.product.Stock < item.Quantity) {
          return {
            success: false,
            error: `Stock insuficiente para ${item.product.Name}. Disponible: ${item.product.Stock}, Requerido: ${item.Quantity}`
          };
        }
      }

      return { success: true, data: promotion };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Crear una nueva promoción
  async create(promotionData) {
    const transaction = await sequelize.transaction();
    try {
      const { Name, Description, Price, StartDate, EndDate, IsActive, Items } = promotionData;

      // Crear la promoción
      const promotion = await Promotion.create({
        Name,
        Description: Description || null,
        Price,
        StartDate: StartDate ? new Date(StartDate) : null,
        EndDate: EndDate ? new Date(EndDate) : null,
        IsActive: IsActive !== undefined ? IsActive : true
      }, { transaction });

      // Crear los items de la promoción
      if (Items && Items.length > 0) {
        for (const item of Items) {
          // Validar que el producto existe
          const product = await Product.findByPk(item.ProductId, { transaction });
          if (!product) {
            await transaction.rollback();
            return { success: false, error: `Producto con ID ${item.ProductId} no encontrado`, status: 404 };
          }

          await PromotionItem.create({
            PromotionId: promotion.Id,
            ProductId: item.ProductId,
            Quantity: item.Quantity || 1
          }, { transaction });
        }
      }

      await transaction.commit();

      // Obtener la promoción completa con items
      const promotionWithItems = await Promotion.findByPk(promotion.Id, {
        include: [{
          model: PromotionItem,
          as: 'promotionItems',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      return {
        success: true,
        data: promotionWithItems,
        message: 'Promoción creada exitosamente',
        status: 201
      };
    } catch (error) {
      await transaction.rollback();
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Actualizar una promoción
  async update(id, promotionData) {
    const transaction = await sequelize.transaction();
    try {
      const promotion = await Promotion.findByPk(id, { transaction });
      if (!promotion) {
        await transaction.rollback();
        return { success: false, error: 'Promoción no encontrada', status: 404 };
      }

      const { Name, Description, Price, StartDate, EndDate, IsActive, Items } = promotionData;

      // Actualizar campos de la promoción
      await promotion.update({
        Name: Name !== undefined ? Name : promotion.Name,
        Description: Description !== undefined ? Description : promotion.Description,
        Price: Price !== undefined ? Price : promotion.Price,
        StartDate: StartDate !== undefined ? (StartDate ? new Date(StartDate) : null) : promotion.StartDate,
        EndDate: EndDate !== undefined ? (EndDate ? new Date(EndDate) : null) : promotion.EndDate,
        IsActive: IsActive !== undefined ? IsActive : promotion.IsActive,
        LastModified: sequelize.literal('CURRENT_TIMESTAMP')
      }, { transaction });

      // Si se proporcionan Items, actualizar los items de la promoción
      if (Items !== undefined) {
        // Eliminar items existentes
        await PromotionItem.destroy({
          where: { PromotionId: id },
          transaction
        });

        // Crear nuevos items
        if (Items.length > 0) {
          for (const item of Items) {
            const product = await Product.findByPk(item.ProductId, { transaction });
            if (!product) {
              await transaction.rollback();
              return { success: false, error: `Producto con ID ${item.ProductId} no encontrado`, status: 404 };
            }

            await PromotionItem.create({
              PromotionId: id,
              ProductId: item.ProductId,
              Quantity: item.Quantity || 1
            }, { transaction });
          }
        }
      }

      await transaction.commit();

      // Obtener la promoción actualizada
      const updatedPromotion = await Promotion.findByPk(id, {
        include: [{
          model: PromotionItem,
          as: 'promotionItems',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      return {
        success: true,
        data: updatedPromotion,
        message: 'Promoción actualizada exitosamente'
      };
    } catch (error) {
      await transaction.rollback();
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Eliminar una promoción
  async delete(id) {
    const transaction = await sequelize.transaction();
    try {
      const promotion = await Promotion.findByPk(id, { transaction });
      if (!promotion) {
        await transaction.rollback();
        return { success: false, error: 'Promoción no encontrada', status: 404 };
      }

      // Eliminar items primero (por foreign key)
      await PromotionItem.destroy({
        where: { PromotionId: id },
        transaction
      });

      // Eliminar la promoción
      await promotion.destroy({ transaction });

      await transaction.commit();
      return { success: true, message: 'Promoción eliminada exitosamente' };
    } catch (error) {
      await transaction.rollback();
      return { success: false, error: error.message, status: 500 };
    }
  }
}

export default new PromotionService();

