import { SupplierProductPrice, Supplier, Product, sequelize } from '../models/index.js';
import { getArgentinaNowSQL } from '../utils/dateHelper.js';

class SupplierProductPriceService {
  // Obtener todos los precios
  async getAll() {
    try {
      const prices = await SupplierProductPrice.findAll({
        include: [
          {
            model: Supplier,
            as: 'supplier'
          },
          {
            model: Product,
            as: 'product'
          }
        ],
        order: [['LastUpdated', 'DESC']]
      });
      return { success: true, data: prices };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener un precio por ID
  async getById(id) {
    try {
      const price = await SupplierProductPrice.findByPk(id, {
        include: [
          {
            model: Supplier,
            as: 'supplier'
          },
          {
            model: Product,
            as: 'product'
          }
        ]
      });
      if (!price) {
        return { success: false, error: 'Precio no encontrado', status: 404 };
      }
      return { success: true, data: price };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Crear un nuevo precio
  async create(priceData) {
    try {
      const price = await SupplierProductPrice.create({
        ...priceData,
        LastUpdated: sequelize.literal(getArgentinaNowSQL())
      });
      return { success: true, data: price, status: 201 };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Actualizar un precio
  async update(id, priceData) {
    try {
      const price = await SupplierProductPrice.findByPk(id);
      if (!price) {
        return { success: false, error: 'Precio no encontrado', status: 404 };
      }
      await price.update({
        ...priceData,
        LastUpdated: sequelize.literal(getArgentinaNowSQL())
      });
      return { success: true, data: price };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Eliminar un precio
  async delete(id) {
    try {
      const price = await SupplierProductPrice.findByPk(id);
      if (!price) {
        return { success: false, error: 'Precio no encontrado', status: 404 };
      }
      await price.destroy();
      return { success: true, message: 'Precio eliminado exitosamente' };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Obtener precios por SupplierId
  async getBySupplierId(supplierId) {
    try {
      const prices = await SupplierProductPrice.findAll({
        where: { SupplierId: supplierId },
        include: [{
          model: Product,
          as: 'product'
        }]
      });
      return { success: true, data: prices };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Obtener precios por ProductId
  async getByProductId(productId) {
    try {
      const prices = await SupplierProductPrice.findAll({
        where: { ProductId: productId },
        include: [{
          model: Supplier,
          as: 'supplier'
        }]
      });
      return { success: true, data: prices };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }
}

export default new SupplierProductPriceService();
