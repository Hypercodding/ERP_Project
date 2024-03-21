const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const Leaves = require('../models/Leaves');
const Loans = require('../models/Loans');

const { sequelize } = require('../db'); // Assuming you have access to the Sequelize instance
const { Sequelize, Op, Transaction } = require('sequelize');
const Account = require('../models/Account');
const Statement = require('../models/Statement');
// const Transaction = require('../models/Transaction');
const createSalary = async (req, res) => {
    try {
        const { employeeId, deductLeaves } = req.body;

        // Find the employee by ID
        const employee = await Employee.findByPk(employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Extract baseSalary from the employee object
        const baseSalary = employee.salary;

        // Log baseSalary
        console.log('Base Salary:', baseSalary);

        // Fetch leaves for the employee for the current month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns zero-based index
        const currentMonthLeaves = await Leaves.findOne({ where: { employeeId, month: currentMonth } });

        // Calculate the salary by deducting leaves if deductLeaves is true
        const deductedLeaves = deductLeaves ? (currentMonthLeaves ? currentMonthLeaves.days : 0) : 0;

        // Log deductedLeaves
        console.log('Deducted Leaves:', deductedLeaves);

        // Calculate the salary
        const calculatedSalary = baseSalary - deductedLeaves;

        // Fetch the employee's loans
        const employeeLoans = await Loans.findAll({ where: { employeeId } });

        // Deduct the monthly installment from each loan
        for (const loan of employeeLoans) {
            const monthlyInstallment = loan.amount / loan.durationMonths;
            const updatedRemainingAmount = loan.remainingAmount - monthlyInstallment;

            // Delete the loan if remaining amount is 0 or less
            if (updatedRemainingAmount <= 0) {
                await Loans.destroy({ where: { id: loan.id } });
            } else {
                // Update the loan with the new remaining amount
                await Loans.update({ remainingAmount: updatedRemainingAmount }, { where: { id: loan.id } });
            }
        }

        // Calculate the total remaining loan amount for deduction
        const totalRemainingLoanAmount = employeeLoans.reduce((total, loan) => total + loan.remainingAmount, 0);

        // Deduct the total remaining loan amount from the calculated salary
        const finalSalary = calculatedSalary - totalRemainingLoanAmount;

        // Create the salary
        const newSalary = await Salary.create({
            employeeId,
            baseSalary, // Include the base salary from employee table
            deductLeaves,
            deductedLeaves,
            totalLoanAmount: totalRemainingLoanAmount,
            finalSalary, // Include the final salary after deducting loans
        });

        res.json({ salary: newSalary, finalSalary });
    } catch (error) {
        console.error('Error creating salary:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const createMultipleSalaries = async (req, res) => {
    try {
        const salariesData = req.body.salaries;

        const newSalaries = [];

        for (const salaryData of salariesData) {
            const { employeeId, deductLeaves } = salaryData;

            // Find the employee by ID
            const employee = await Employee.findByPk(employeeId);

            if (!employee) {
                console.error(`Employee with ID ${employeeId} not found`);
                continue; // Skip to the next salaryData
            }

            // Extract baseSalary from the employee object
            const baseSalary = employee.salary;

            // Fetch leaves for the employee for the current month
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // getMonth() returns zero-based index
            const currentMonthLeaves = await Leaves.findOne({ where: { employeeId, month: currentMonth } });

            // Calculate the salary by deducting leaves if deductLeaves is true
            const deductedLeaves = deductLeaves ? (currentMonthLeaves ? currentMonthLeaves.days : 0) : 0;

            // Calculate the salary
            const calculatedSalary = baseSalary - deductedLeaves;

            // Fetch the employee's loans
            const employeeLoans = await Loans.findAll({ where: { employeeId } });

            // Deduct the total remaining loan amount for deduction
            const totalRemainingLoanAmount = employeeLoans.reduce((total, loan) => total + loan.remainingAmount, 0);

            // Deduct the total remaining loan amount from the calculated salary
            const finalSalary = calculatedSalary - totalRemainingLoanAmount;

            // Create the salary
            const newSalary = await Salary.create({
                employeeId,
                baseSalary, // Include the base salary from employee table
                deductLeaves,
                deductedLeaves,
                totalLoanAmount: totalRemainingLoanAmount,
                finalSalary, // Include the final salary after deducting loans
            });

            newSalaries.push(newSalary);
        }

        res.json({ salaries: newSalaries });
    } catch (error) {
        console.error('Error creating salaries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllSalaries = async(req,res)=>{
    try {
        const salary = await Salary.findAll();
    res.status(200).json(salary)
    } catch (error) {
        console.error('Error getting salaries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    createSalary,
    createMultipleSalaries,
    getAllSalaries,
};
