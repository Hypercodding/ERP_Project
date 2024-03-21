const Employee = require('../models/Employee');

const addEmployee = async(req,res)=>{
    try {
        const {employeeName, cnic, phoneNumber, gender, dateOfJoining, dateOfBirth, companyId, designation, salary} = req.body;
        
        if (!employeeName || !cnic || !phoneNumber || !gender || !dateOfJoining || !dateOfBirth || !companyId || !designation) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const employee = await Employee.create({
            employeeName,
            cnic,
            phoneNumber,
            dateOfBirth,
            dateOfJoining,
            gender,
            companyId,
            designation,
            salary,
        });
        console.log(employee)
        res.status(201).json(employee);
        
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
   
 
};

const getEmployee = async(req,res)=> {
    try {
        const employee = await Employee.findAll();

        res.status(200).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const editEmployee = async (req, res) => {
    const { id } = req.params;
    const { employeeName, phoneNumber,designation } = req.body;
  
    try {
      let employee = await Employee.findByPk(id);
  
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      // Update the company data
      employee.employeeName = employeeName;
      employee.phoneNumber = phoneNumber;
      employee.designation = designation;
  
      // Save the changes
      await employee.save();
  
      res.status(200).json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
const deleteEmployee = async(req,res)=>{
    const { id } = req.params;

    try {
        // Find the company by ID
        const employee = await Employee.findByPk(id);
  
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
  
        // Delete the company
        await employee.destroy();
  
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
}

module.exports = {
    addEmployee,
    getEmployee,
    editEmployee,
    deleteEmployee,
}