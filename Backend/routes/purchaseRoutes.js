const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const {upload} =require('../controllers/purchaseController')
// Route for creating a new purchase
router.post('/', purchaseController.upload, purchaseController.createPurchase);
router.get('/getPurchases', purchaseController.getAllPurchases);


// Add more routes as needed (e.g., fetching purchases, updating purchases, etc.)

module.exports = router;
