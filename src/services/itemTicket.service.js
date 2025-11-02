import { ItemTicket, Product, Sale } from '../models/index.js';

class ItemTicketService {
  // Obtener todos los ítems de ticket
  async getAll() {
    try {
      const items = await ItemTicket.findAll({
        include: [
          {
            model: Product,
            as: 'product'
          },
          {
            model: Sale,
            as: 'sale'
          }
        ],
        order: [['Id', 'DESC']]
      });
      return { success: true, data: items };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener un ítem por ID
  async getById(id) {
    try {
      const item = await ItemTicket.findByPk(id, {
        include: [
          {
            model: Product,
            as: 'product'
          },
          {
            model: Sale,
            as: 'sale'
          }
        ]
      });
      if (!item) {
        return { success: false, error: 'Ítem no encontrado', status: 404 };
      }
      return { success: true, data: item };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Crear un nuevo ítem
  async create(itemData) {
    try {
      const item = await ItemTicket.create(itemData);
      return { success: true, data: item, status: 201 };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Actualizar un ítem
  async update(id, itemData) {
    try {
      const item = await ItemTicket.findByPk(id);
      if (!item) {
        return { success: false, error: 'Ítem no encontrado', status: 404 };
      }
      await item.update(itemData);
      return { success: true, data: item };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Eliminar un ítem
  async delete(id) {
    try {
      const item = await ItemTicket.findByPk(id);
      if (!item) {
        return { success: false, error: 'Ítem no encontrado', status: 404 };
      }
      await item.destroy();
      return { success: true, message: 'Ítem eliminado exitosamente' };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Obtener ítems por SaleId
  async getBySaleId(saleId) {
    try {
      const items = await ItemTicket.findAll({
        where: { SaleId: saleId },
        include: [{
          model: Product,
          as: 'product'
        }]
      });
      return { success: true, data: items };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }
}

export default new ItemTicketService();
