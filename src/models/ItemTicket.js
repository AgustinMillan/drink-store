import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ItemTicket = sequelize.define('ItemTicket', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  SaleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'SaleId',
    references: {
      model: 'Sale',
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
  Print: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'Print'
  },
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'Amount'
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'Quantity'
  }
}, {
  tableName: 'ItemTicket',
  timestamps: false,
  underscored: false
});

export default ItemTicket;
