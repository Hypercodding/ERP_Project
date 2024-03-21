const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Assuming you have a Sequelize instance set up
const Employee = require('./Employee');

const Salary = sequelize.define('Salary', {
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee,
      key: 'id',
    },
  },
  deductLeaves: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deductedLeaves: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalLoanAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  finalSalary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  // Add any other fields you may need
}, { timestamps: true });


Salary.belongsTo(Employee, { foreignKey: 'employeeId' });

sequelize.sync();
module.exports = Salary;
