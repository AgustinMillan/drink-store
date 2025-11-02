import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { getArgentinaNowSQL } from '../utils/dateHelper.js';

const BusinessMovement = sequelize.define('BusinessMovement', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
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
  SupplierId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'SupplierId',
    references: {
      model: 'Supplier',
      key: 'Id'
    }
  },
  Type: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'Type',
    validate: {
      isIn: [['IN', 'OUT']]
    }
  },
  Reason: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'Reason',
    validate: {
      isIn: [['SALE', 'PURCHASE', 'ADJUSTMENT', 'LOSS']]
    }
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'Quantity'
  },
  UnitCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'UnitCost'
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'TotalAmount'
  },
  ReferenceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ReferenceId'
  },
  ReferenceType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'ReferenceType'
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal(getArgentinaNowSQL()),
    field: 'CreatedAt'
  }
}, {
  tableName: 'BusinessMovement',
  timestamps: false,
  underscored: false
});

export default BusinessMovement;

