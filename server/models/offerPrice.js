// models/offerPrice.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const offerPrice = sequelize.define('offerPrice', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    user_id: {
        type: Sequelize.INTEGER,
        references:{
            model: 'Users',
            key: 'user_id'
        }
    },
    listing_id: {
        type: Sequelize.INTEGER,
        references:{
            model: 'Listings',
            key: 'id'
        }
    },
    offerprice: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

// force: true: true-will drop the table if it already exists
offerPrice.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("OfferPrice tables synched");
    offerPrice.upsert({
        id: 1,
        user_id: 1,
        listing_id: 2,
        offerprice: 60.00
    }),
    offerPrice.upsert({
        id: 2,
        user_id: 1,
        listing_id: 1,
        offerprice: 60.00
    })
});

module.exports = sequelize.model('offerPrice', offerPrice);