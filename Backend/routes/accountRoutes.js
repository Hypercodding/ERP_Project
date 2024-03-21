const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/', accountController.getAllAccounts);
router.post('/add-account', accountController.createAccount);
router.put('/edit-account/:id', accountController.updateAccount);
router.delete('/delete-account/:id', accountController.deleteAccount);

module.exports = router;
