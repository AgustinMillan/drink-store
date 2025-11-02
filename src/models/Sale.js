import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { getArgentinaNowSQL } from '../utils/dateHelper.js';

const Sale = sequelize.define('Sale', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'Amount'
  },
  TicketNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'TicketNumber'
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal(getArgentinaNowSQL()),
    field: 'CreatedAt'
  }
}, {
  tableName: 'Sale',
  timestamps: false,
  underscored: false
});

export default Sale;
