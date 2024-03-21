const Leaves = require('../models/Leaves');

const addLeaves = async (req, res) => {
    try {
        const { employeeId, startDate, endDate, isDeducted } = req.body;
        
        // Check if startDate is a valid date
        if (!(new Date(startDate) instanceof Date && !isNaN(new Date(startDate)))) {
            throw new Error('startDate must be a valid date');
        }

        // Check if endDate is a valid date
        if (!(new Date(endDate) instanceof Date && !isNaN(new Date(endDate)))) {
            throw new Error('endDate must be a valid date');
        }

        // Calculate the difference in days between start date and end date
        const diffInDays = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

        // Extract month and year from the start date
        const startMonth = new Date(startDate).getMonth() + 1; // Adding 1 because months are zero-indexed
        const startYear = new Date(startDate).getFullYear();

        // Create a new leave entry
        const newLeave = await Leaves.create({
            employeeId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            days: diffInDays,
            month: startMonth,
            year: startYear,
            isDeducted,
        });

        res.status(201).json(newLeave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




const getAllLeaves = async (req, res) => {
    try {
        // Fetch all leaves
        const allLeaves = await Leaves.findAll();
        res.status(200).json(allLeaves);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const editLeave = async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate, isDeducted } = req.body;

    try {
        let leave = await Leaves.findByPk(id);

        if (!leave) { 
            return res.status(404).json({ error: 'Leave not found' });
        }
  
        // Update the leave data
        if (startDate !== undefined) {
            leave.startDate = startDate;
        }
        if (endDate !== undefined) {
            leave.endDate = endDate;
        }
        if (isDeducted !== undefined) {
            leave.isDeducted = isDeducted;
        }

        // Save the changes
        await leave.save();

        res.status(200).json(leave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const deleteLeave = async(req,res)=>{
    try {
        const { id } = req.params; // Get the leave ID from request parameters
        const leave = await Leaves.findByPk(id);
  
        if (!leave) {
            return res.status(404).json({ error: 'Leave not found' });
        }
  
        // Delete the company
        await leave.destroy();
  
        res.status(200).json({ message: 'Leave deleted successfully' });
    } catch (error) {
        console.error('Error deleting leave:', error);
        // Send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

module.exports ={
    addLeaves,
    getAllLeaves,
    editLeave,
    deleteLeave,
}