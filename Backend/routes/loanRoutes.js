const express = require('express');
const loansController = require('../controllers/loansController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/getAllLoans',  loansController.getAllLoans);
router.post('/grant', authMiddleware, loansController.grantLoan);
// router.put('/edit-leave/:id', leavesController.editLeave)
// router.delete('/delete-leave/:id', leavesController.deleteLeave)


module.exports = router;
