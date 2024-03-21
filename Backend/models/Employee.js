const sequelize = require("../db");
const { DataTypes } = require('sequelize');
const Company = require('./Company');
const { foreign_key } = require("inflection");

const Employee = sequelize.define('Employee',{
    employeeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cnic: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
    },
    phoneNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female'), // Use ENUM for gender
        allowNull: false
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dateOfJoining: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Company',
            key: 'id',
        },
    },
    salary: {
        type: DataTypes.BIGINT,
         
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    overTime: {
        type: DataTypes.FLOAT,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
})
Employee.belongsTo(Company, { foreign_key: 'companyId', as: 'company'});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(err => {
    console.error('Database synchronization failed:', err);
  });
module.exports = Employee;