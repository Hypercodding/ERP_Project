// transactionModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Account = require('./Account');

const Transaction = sequelize.define('Transaction', {
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Account,
      key: 'id'
    }
  },
  transaction_type: {
    type: DataTypes.ENUM('IN', 'OUT'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

Transaction.belongsTo(Account, { foreignKey: 'account_id' });
Account.hasMany(Transaction, { foreignKey: 'account_id' });

sequelize.sync();
module.exports = Transaction;
