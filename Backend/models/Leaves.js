const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Employee = require('./Employee');

const Leaves = sequelize.define('Leaves', {
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'id',
        },
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    days: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isDeducted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
});

// Define associations
// Define associations
Leaves.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'id', tableName: 'Employee' });

// Sync the model with the database
sequelize.sync();

module.exports = Leaves;
