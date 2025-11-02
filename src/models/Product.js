import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { getArgentinaNowSQL } from '../utils/dateHelper.js';

const Product = sequelize.define('Product', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'Name'
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'Description'
  },
  AmountToSale: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'AmountToSale'
  },
  AmountSupplier: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'AmountSupplier'
  },
  Stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'Stock'
  },
  LastModified: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal(getArgentinaNowSQL()),
    field: 'LastModified'
  }
}, {
  tableName: 'Product',
  timestamps: false,
  underscored: false
});

export default Product;
