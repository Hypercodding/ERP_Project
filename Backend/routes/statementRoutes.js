const express = require('express');
const router = express.Router();
const statementController = require('../controllers/statementController');

router.get('/', statementController.getAllStatements);
router.post('/', statementController.createStatement);
router.put('/:id', statementController.updateStatement);
router.delete('/:id', statementController.deleteStatement);

module.exports = router;
