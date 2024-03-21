const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const inventoryController = require('../controllers/inventoryController');

router.get('/', authMiddleware, inventoryController.getInventory);

module.exports = router;