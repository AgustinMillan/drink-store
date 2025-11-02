import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { getArgentinaNowSQL } from '../utils/dateHelper.js';

const SupplierProductPrice = sequelize.define('SupplierProductPrice', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  SupplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'SupplierId',
    references: {
      model: 'Supplier',
      key: 'Id'
    }
  },
  ProductId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ProductId',
    references: {
      model: 'Product',
      key: 'Id'
    }
  },
  UnitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'UnitPrice'
  },
  LastUpdated: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal(getArgentinaNowSQL()),
    field: 'LastUpdated'
  }
}, {
  tableName: 'SupplierProductPrice',
  timestamps: false,
  underscored: false
});

export default SupplierProductPrice;

