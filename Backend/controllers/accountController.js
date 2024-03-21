const Account = require('../models/Account');

const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll();
        res.status(200).json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createAccount = async (req, res) => {
    const { account_name, account_type,balance } = req.body;
    try {
        const account = await Account.create({ account_name, account_type, balance });
        res.status(201).json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateAccount = async (req, res) => {
    const { id } = req.params;
    const { name, balance } = req.body;
    try {
        let account = await Account.findByPk(id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        account.name = name;
        account.balance = balance;
        await account.save();
        res.status(200).json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await Account.findByPk(id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        await account.destroy();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {
    getAllAccounts,
    deleteAccount,
    updateAccount,
    createAccount,
}