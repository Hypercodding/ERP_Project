const Transaction = require('../models/Transaction');

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createTransaction = async (req, res) => {
    const { accountId, amount, type } = req.body;
    try {
        const transaction = await Transaction.create({ accountId, amount, type });
        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { accountId, amount, type } = req.body;
    try {
        let transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        transaction.accountId = accountId;
        transaction.amount = amount;
        transaction.type = type;
        await transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        await transaction.destroy();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    deleteTransaction,
    updateTransaction,
    createTransaction,
    getAllTransactions
}