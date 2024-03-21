const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const Items = require('./Items');

const Inventory = sequelize.define('Inventory', {
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Items',
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})
Inventory.belongsTo(Items, { foreign_key: 'itemId', as: 'items'});

sequelize.sync();
module.exports = Inventory