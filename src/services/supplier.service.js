import { Supplier } from '../models/index.js';

class SupplierService {
  // Obtener todos los proveedores
  async getAll() {
    try {
      const suppliers = await Supplier.findAll({
        order: [['CreatedAt', 'DESC']]
      });
      return { success: true, data: suppliers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener un proveedor por ID
  async getById(id) {
    try {
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return { success: false, error: 'Proveedor no encontrado', status: 404 };
      }
      return { success: true, data: supplier };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Crear un nuevo proveedor
  async create(supplierData) {
    try {
      const supplier = await Supplier.create(supplierData);
      return { success: true, data: supplier, status: 201 };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Actualizar un proveedor
  async update(id, supplierData) {
    try {
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return { success: false, error: 'Proveedor no encontrado', status: 404 };
      }
      await supplier.update(supplierData);
      return { success: true, data: supplier };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Eliminar un proveedor
  async delete(id) {
    try {
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return { success: false, error: 'Proveedor no encontrado', status: 404 };
      }
      await supplier.destroy();
      return { success: true, message: 'Proveedor eliminado exitosamente' };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }
}

export default new SupplierService();
