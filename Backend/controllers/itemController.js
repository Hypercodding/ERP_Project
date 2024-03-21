const Items = require('../models/Items');

const addItem = async (req, res) => {
    try {
        // Extract item details from request body
        const { itemName, itemNo } = req.body;

        // Create the item in the database
        const newItem = await Items.create({ itemName, itemNo });

        res.status(201).json({ success: true, message: 'Item added successfully', item: newItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getAllItems = async (req, res) => {
    try {
        // Fetch all items from the database
        const allItems = await Items.findAll();

        res.status(200).json(allItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const editItem = async(req,res)=>{
try {
    const itemId = req.params.itemId;
    const { itemName, itemNo } = req.body;

    // Find the item by itemId
    const item = await Items.findByPk(itemId);

    // If item not found, return 404 Not Found
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }

    // Update item details
    item.itemName = itemName;
    item.itemNo = itemNo;

    // Save the updated item
    await item.save();

    res.json({ message: 'Item updated successfully', item });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
}
};


const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;

        // Find the item by itemId
        const item = await Items.findByPk(itemId);

        // If item not found, return 404 Not Found
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Delete the item
        await item.destroy();

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports= {
    addItem,
    getAllItems,
    editItem,
    deleteItem
}

