const User = require("../models/User");

const users = async(req,res)=>{
    try {
        const { role } = req.query;
        const users = await User.findAll({ where: { role } });
        res.json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

const usersName = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
      // Find manager with the specified ID
      const manager = await User.findOne({ where: { id: id } });

      if (manager) {
          res.json(manager); // Return manager details if found
      } else {
          res.status(404).json({ error: 'Manager not found' }); // Return 404 if manager not found
      }
  } catch (error) {
      console.error('Error fetching manager:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
    users,
    usersName,
}