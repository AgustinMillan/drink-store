import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { getArgentinaNowSQL } from '../utils/dateHelper.js';

const Promotion = sequelize.define('Promotion', {
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
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'Description'
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'Price'
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'StartDate'
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'EndDate'
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'IsActive'
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal(getArgentinaNowSQL()),
    field: 'CreatedAt'
  },
  LastModified: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal(getArgentinaNowSQL()),
    field: 'LastModified'
  }
}, {
  tableName: 'Promotion',
  timestamps: false,
  underscored: false
});

export default Promotion;

