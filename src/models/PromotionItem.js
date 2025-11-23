import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PromotionItem = sequelize.define('PromotionItem', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  PromotionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'PromotionId',
    references: {
      model: 'Promotion',
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
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'Quantity'
  }
}, {
  tableName: 'PromotionItem',
  timestamps: false,
  underscored: false
});

export default PromotionItem;

