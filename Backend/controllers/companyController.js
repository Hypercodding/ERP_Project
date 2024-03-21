const Company = require('../models/Company');

// PUT /companies/:id
const editCompany = async (req, res) => {
  const { id } = req.params;
  const { companyName, companyStatus } = req.body;

  try {
      // Find the company by ID
      let company = await Company.findByPk(id);

      if (!company) {
          return res.status(404).json({ error: 'Company not found' });
      }

      // Update the company data
      company.companyName = companyName;
      company.companyStatus = companyStatus;

      // Save the changes
      await company.save();

      res.status(200).json(company);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /companies/:id
const deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
      // Find the company by ID
      const company = await Company.findByPk(id);

      if (!company) {
          return res.status(404).json({ error: 'Company not found' });
      }

      // Delete the company
      await company.destroy();

      res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  } 
};

const getAllCompanies = async (req, res) => {
  try {
    // Fetch all companies from the database
    const companies = await Company.findAll();

    // Return the list of companies as JSON response
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createCompany = async (req, res) => {
  try {
    const { companyName, companyStatus } = req.body;

    // Ensure req.user exists and contains userId
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized - Missing userId' });
    }

    // Create a new company with the userId from the token
    const company = await Company.create({
      companyName,
      companyStatus,
      userId: req.user.userId,
    });

    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const assignCompanyToManager = async (req, res) => {
  const { companyId, managerId } = req.params;

  try {
    // Find the company by ID
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Assign the company to the manager
    company.managerId = managerId;
    await company.save();

    res.status(200).json({ message: 'Company assigned to manager successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = {
  getAllCompanies,
  createCompany,
  editCompany,
  deleteCompany,
  assignCompanyToManager,
  // Add functions for update and delete
};
