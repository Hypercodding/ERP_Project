const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Account = sequelize.define('Account', {
  account_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  account_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
});

sequelize.sync();
module.exports = Account;
