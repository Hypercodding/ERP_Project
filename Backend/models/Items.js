// itemModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Assuming you have a Sequelize instance set up

const Items = sequelize.define('Items', {
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Assuming itemNo should be unique
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

sequelize.sync();
module.exports = Items;
