// statementModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Account = require('./Account');

const Statement = sequelize.define('Statement', {
    accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Account,
      key: 'id'
    }
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  starting_balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  ending_balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  total_inward: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  total_outward: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  total_transactions: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Statement.belongsTo(Account, { foreignKey: 'account_id' });
Account.hasMany(Statement, { foreignKey: 'account_id' });

sequelize.sync();
module.exports = Statement;
