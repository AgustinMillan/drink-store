import sequelize from '../config/database.js';

// Importar todos los modelos
import Product from './Product.js';
import Sale from './Sale.js';
import ItemTicket from './ItemTicket.js';
import Supplier from './Supplier.js';
import BusinessMovement from './BusinessMovement.js';
import SupplierProductPrice from './SupplierProductPrice.js';
import BusinessState from './BusinessState.js';

// Definir relaciones

// Relación Product <-> ItemTicket (uno a muchos)
Product.hasMany(ItemTicket, {
  foreignKey: 'ProductId',
  as: 'itemTickets'
});

ItemTicket.belongsTo(Product, {
  foreignKey: 'ProductId',
  as: 'product'
});

// Relación Sale <-> ItemTicket (uno a muchos)
Sale.hasMany(ItemTicket, {
  foreignKey: 'SaleId',
  as: 'itemTickets'
});

ItemTicket.belongsTo(Sale, {
  foreignKey: 'SaleId',
  as: 'sale'
});

// Relación Product <-> BusinessMovement (uno a muchos)
Product.hasMany(BusinessMovement, {
  foreignKey: 'ProductId',
  as: 'businessMovements'
});

BusinessMovement.belongsTo(Product, {
  foreignKey: 'ProductId',
  as: 'product'
});

// Relación Supplier <-> BusinessMovement (uno a muchos, opcional)
Supplier.hasMany(BusinessMovement, {
  foreignKey: 'SupplierId',
  as: 'businessMovements'
});

BusinessMovement.belongsTo(Supplier, {
  foreignKey: 'SupplierId',
  as: 'supplier'
});

// Relación Supplier <-> SupplierProductPrice (uno a muchos)
Supplier.hasMany(SupplierProductPrice, {
  foreignKey: 'SupplierId',
  as: 'productPrices'
});

SupplierProductPrice.belongsTo(Supplier, {
  foreignKey: 'SupplierId',
  as: 'supplier'
});

// Relación Product <-> SupplierProductPrice (uno a muchos)
Product.hasMany(SupplierProductPrice, {
  foreignKey: 'ProductId',
  as: 'supplierPrices'
});

SupplierProductPrice.belongsTo(Product, {
  foreignKey: 'ProductId',
  as: 'product'
});

// Sincronizar modelos con la base de datos
export const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
    throw error;
  }
};

// Exportar todos los modelos y sequelize
export {
  Product,
  Sale,
  ItemTicket,
  Supplier,
  BusinessMovement,
  SupplierProductPrice,
  BusinessState,
  sequelize
};

export default sequelize;