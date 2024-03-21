const express = require('express');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add-item', itemController.addItem);
router.get('/', itemController.getAllItems);
// Edit item
router.put('/edit-item/:itemId', itemController.editItem);

// Delete item
router.delete('/delete-item/:itemId', itemController.deleteItem);

module.exports = router;