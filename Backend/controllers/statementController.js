const Statement = require('../models/Statement');

const getAllStatements = async (req, res) => {
    try {
        const statements = await Statement.findAll();
        res.status(200).json(statements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createStatement = async (req, res) => {
    const { accountId, description, amount, date } = req.body;
    try {
        const statement = await Statement.create({ accountId, description, amount, date });
        res.status(201).json(statement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateStatement = async (req, res) => {
    const { id } = req.params;
    const { accountId, description, amount, date } = req.body;
    try {
        let statement = await Statement.findByPk(id);
        if (!statement) {
            return res.status(404).json({ error: 'Statement not found' });
        }
        statement.accountId = accountId;
        statement.description = description;
        statement.amount = amount;
        statement.date = date;
        await statement.save();
        res.status(200).json(statement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteStatement = async (req, res) => {
    const { id } = req.params;
    try {
        const statement = await Statement.findByPk(id);
        if (!statement) {
            return res.status(404).json({ error: 'Statement not found' });
        }
        await statement.destroy();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllStatements,
    updateStatement,
    createStatement,
    deleteStatement
}