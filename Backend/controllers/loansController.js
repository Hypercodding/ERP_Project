const Loans = require('../models/Loans');
const Employee = require('../models/Employee');

// Controller function to grant a loan to an employee
const grantLoan = async (req, res) => {
    try {
        const { employeeId, amount, durationMonths } = req.body;

        // Check if the employee exists
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Calculate monthly installment
        const monthlyInstallment = amount / durationMonths;

        // Create loan entry
        const loan = await Loans.create({
            employeeId,
            amount,
            durationMonths,
            remainingAmount: amount,
            monthlyInstallment: monthlyInstallment
        });

        return res.status(201).json({ loan, monthlyInstallment });
    } catch (error) {
        console.error('Error granting loan:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllLoans = async(req,res)=>{
try {
    const loans = await Loans.findAll();
    res.status(200).json(loans)

} catch (error) {
    nsole.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
}
};
module.exports = {
    grantLoan,
    getAllLoans

}