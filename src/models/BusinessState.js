import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { getArgentinaNowSQL } from '../utils/dateHelper.js';

const BusinessState = sequelize.define('BusinessState', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal(getArgentinaNowSQL()),
    field: 'Date'
  },
  TotalStockValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'TotalStockValue'
  },
  TotalSales: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'TotalSales'
  },
  TotalPurchases: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'TotalPurchases'
  },
  TotalProfit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'TotalProfit'
  },
  Notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'Notes'
  }
}, {
  tableName: 'BusinessState',
  timestamps: false,
  underscored: false
});

export default BusinessState;

