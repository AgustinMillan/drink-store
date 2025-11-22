import { BusinessState, sequelize } from '../models/index.js';
import { getArgentinaNowSQL } from '../utils/dateHelper.js';
import productService from './product.service.js';

class BusinessStateService {
  // Obtener todos los estados
  async getAll() {
    try {
      const states = await BusinessState.findAll({
        order: [['Date', 'DESC']]
      });
      return { success: true, data: states };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener un estado por ID
  async getById(id) {
    try {
      const state = await BusinessState.findByPk(id);
      if (!state) {
        return { success: false, error: 'Estado no encontrado', status: 404 };
      }

      const totalStockValue = await productService.getProductStockValue();

      return { success: true, data: { ...state.dataValues, TotalStockValue: totalStockValue.data } };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Crear un nuevo estado
  async create(stateData) {
    try {
      const state = await BusinessState.create({
        ...stateData,
        Date: stateData.Date || sequelize.literal(getArgentinaNowSQL())
      });
      return { success: true, data: state, status: 201 };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Actualizar un estado
  async update(id, stateData) {
    try {
      const state = await BusinessState.findByPk(id);
      if (!state) {
        return { success: false, error: 'Estado no encontrado', status: 404 };
      }
      await state.update(stateData);
      return { success: true, data: state };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Eliminar un estado
  async delete(id) {
    try {
      const state = await BusinessState.findByPk(id);
      if (!state) {
        return { success: false, error: 'Estado no encontrado', status: 404 };
      }
      await state.destroy();
      return { success: true, message: 'Estado eliminado exitosamente' };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Obtener el último estado
  async getLatest() {
    try {
      const state = await BusinessState.findOne({
        order: [['Date', 'DESC']]
      });
      if (!state) {
        return { success: false, error: 'No hay estados registrados', status: 404 };
      }
      return { success: true, data: state };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  async addBalance(amount) {
    try {
      const state = await BusinessState.findByPk(1);
      if (!state) {
        return { success: false, error: 'Estado no encontrado', status: 404 };
      }
      await state.update({
        Balance: Number(state.Balance) + Number(amount)
      });
      await state.save();

      return { success: true, message: 'Balance actualizado exitosamente' };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  async subtractBalance(amount) {
    try {
      const state = await BusinessState.findByPk(1);

      await state.update({
        Balance: state.Balance - amount
      });

      await state.save();

      return { success: true, message: 'Balance actualizado exitosamente' };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }
}

export default new BusinessStateService();
