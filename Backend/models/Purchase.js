const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const Items = require('./Items');
const Account = require('./Account');

const Purchase = sequelize.define('Purchase', {
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Items,
            key: 'id',
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amountPerPiece: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    vendorName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Account,
            key: 'id',
        }
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    receipt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

Purchase.belongsTo(Items, { foreignKey: 'itemId' });
Purchase.belongsTo(Account, { foreignKey: 'accountId' });

sequelize.sync();
module.exports = Purchase;
