import { BusinessMovement, Product, Supplier } from '../models/index.js';

class BusinessMovementService {
  // Obtener todos los movimientos
  async getAll() {
    try {
      const movements = await BusinessMovement.findAll({
        include: [
          {
            model: Product,
            as: 'product'
          },
          {
            model: Supplier,
            as: 'supplier'
          }
        ],
        order: [['CreatedAt', 'DESC']]
      });
      return { success: true, data: movements };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener un movimiento por ID
  async getById(id) {
    try {
      const movement = await BusinessMovement.findByPk(id, {
        include: [
          {
            model: Product,
            as: 'product'
          },
          {
            model: Supplier,
            as: 'supplier'
          }
        ]
      });
      if (!movement) {
        return { success: false, error: 'Movimiento no encontrado', status: 404 };
      }
      return { success: true, data: movement };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Crear un nuevo movimiento
  async create(movementData) {
    try {
      const movement = await BusinessMovement.create(movementData);
      return { success: true, data: movement, status: 201 };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Actualizar un movimiento
  async update(id, movementData) {
    try {
      const movement = await BusinessMovement.findByPk(id);
      if (!movement) {
        return { success: false, error: 'Movimiento no encontrado', status: 404 };
      }
      await movement.update(movementData);
      return { success: true, data: movement };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Eliminar un movimiento
  async delete(id) {
    try {
      const movement = await BusinessMovement.findByPk(id);
      if (!movement) {
        return { success: false, error: 'Movimiento no encontrado', status: 404 };
      }
      await movement.destroy();
      return { success: true, message: 'Movimiento eliminado exitosamente' };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Obtener movimientos por ProductId
  async getByProductId(productId) {
    try {
      const movements = await BusinessMovement.findAll({
        where: { ProductId: productId },
        include: [{
          model: Supplier,
          as: 'supplier'
        }],
        order: [['CreatedAt', 'DESC']]
      });
      return { success: true, data: movements };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }
}

export default new BusinessMovementService();
