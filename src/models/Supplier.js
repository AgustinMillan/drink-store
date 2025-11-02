import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { getArgentinaNowSQL } from '../utils/dateHelper.js';

const Supplier = sequelize.define('Supplier', {
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
  ContactName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'ContactName'
  },
  Phone: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'Phone'
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'Email'
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'Address'
  },
  Notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'Notes'
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal(getArgentinaNowSQL()),
    field: 'CreatedAt'
  }
}, {
  tableName: 'Supplier',
  timestamps: false,
  underscored: false
});

export default Supplier;

