const Purchase = require('../models/Purchase');
const multer = require('multer');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'E:/Usman_ERP/backend/uploads/'); // Set the destination folder where the files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.uploads); // Set the filename to avoid naming conflicts
  }
});
const upload = multer({ storage: storage }).single('receipt');

// Controller function to create a new purchase
const createPurchase = async (req, res) => {
  try {
    // Assuming req.body contains the necessary purchase data
    const { itemId, quantity, amountPerPiece, totalAmount, vendorName, accountId, expiryDate, purchaseDate } = req.body;

    // Create the purchase
    const purchase = await Purchase.create({
      itemId,
      quantity,
      amountPerPiece,
      totalAmount,
      vendorName,
      accountId,
      expiryDate,
      receipt: req.file.path, // Set the path to the uploaded file
      purchaseDate
    });

    // Send a success response
    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getAllPurchases = async(req,res)=>{
    const purchase = await Purchase.findAll();
    res.status(201).json(purchase);
}

module.exports = {
  createPurchase,
  upload,
  getAllPurchases
};
