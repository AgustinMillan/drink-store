import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BusinessState = sequelize.define('BusinessState', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  TotalStockValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'TotalStockValue'
  },
  Balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'Balance'
  },
}, {
  tableName: 'BusinessState',
  timestamps: false,
  underscored: false
});

export default BusinessState;

