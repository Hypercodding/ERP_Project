const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Employee = require('./Employee');

const Loans = sequelize.define('Loans', {
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.FLOAT,
    },
    durationMonths: {
        type: DataTypes.INTEGER,
    },
    remainingAmount: {
        type: DataTypes.FLOAT,
    },
    monthlyInstallment: {
        type: DataTypes.FLOAT,
    }

});

// Define associations
Loans.belongsTo(Employee, { foreignKey: 'employeeId' });

// Sync the model with the database
sequelize.sync();

module.exports = Loans;
