// Company.js
const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const User = require('./User');

const Company = sequelize.define('Company', {
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    companyStatus: {
        type: DataTypes.ENUM('Active', 'InActive'),
        defaultValue: 'Active',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
});

Company.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // Associate with user
Company.belongsTo(User, { foreignKey: 'managerId', as: 'manager' }); // Associate with manager

sequelize.sync();

module.exports = Company;
