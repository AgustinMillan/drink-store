import { Sequelize, Op } from "sequelize";
import { Product, Supplier, SupplierProductPrice } from "../models/index.js";

class ProductService {
  // Obtener todos los productos
  async getAll() {
    try {
      const products = await Product.findAll({
        order: [["Id", "DESC"]],
      });
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener un producto por ID
  async getById(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return { success: false, error: "Producto no encontrado", status: 404 };
      }
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Crear un nuevo producto
  async create(productData) {
    try {
      const product = await Product.create(productData);
      return { success: true, data: product, status: 201 };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Actualizar un producto
  async update(id, productData) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return { success: false, error: "Producto no encontrado", status: 404 };
      }
      await product.update(productData);
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Obtener el mejor precio por producto
  async getBestPrice() {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: SupplierProductPrice,
            as: "supplierPrices",
            include: {
              model: Supplier,
              as: "supplier",
              attributes: ["Id", "Name"],
            },
            where: {
              UnitPrice: {
                [Sequelize.Op.eq]: Sequelize.literal(`(
                  SELECT MIN("UnitPrice")
                  FROM "SupplierProductPrice" spp
                  WHERE spp."ProductId" = "Product"."Id"
                )`),
              },
            },
            required: false,
          },
        ],
      });

      return {
        success: true,
        data: products.map((product) => {
          if (product.supplierPrices.length > 0) {
            return {
              Id: product.Id,
              Name: product.Name,
              AmountSupplier: product.supplierPrices[0].UnitPrice,
              NameSupplier: product.supplierPrices[0].supplier.Name,
            };
          }
          return {
            Id: product.Id,
            Name: product.Name,
            AmountSupplier: null,
            NameSupplier: null,
          };
        }),
      };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Eliminar un producto
  async delete(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return { success: false, error: "Producto no encontrado", status: 404 };
      }
      await product.destroy();
      return { success: true, message: "Producto eliminado exitosamente" };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Obtener productos con stock bajo (menos de 5)
  async getLowStock(threshold = 5) {
    try {
      const products = await Product.findAll({
        where: {
          Stock: {
            [Op.lt]: threshold,
          },
        },
        order: [
          ["Stock", "ASC"],
          ["Name", "ASC"],
        ],
      });

      return {
        success: true,
        data: products,
        count: products.length,
        threshold,
      };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Actualizar precios de productos
  async bulkUpdatePrices() {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: SupplierProductPrice,
            as: "supplierPrices",
            where: {
              UnitPrice: {
                [Sequelize.Op.eq]: Sequelize.literal(`(
                  SELECT MIN("UnitPrice")
                  FROM "SupplierProductPrice" spp
                  WHERE spp."ProductId" = "Product"."Id"
                )`),
              },
            },
            required: false,
          },
        ],
      });

      products.forEach((product) => {
        if (product.supplierPrices.length > 0) {
          product.update({
            AmountSupplier: Number(product.supplierPrices[0].UnitPrice).toFixed(
              0
            ),
          });
        }
      });

      return { success: true, message: "Precios actualizados exitosamente" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new ProductService();
