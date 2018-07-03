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
    listing: {
        type: Sequelize.STRING,
        allowNull: false
    },
    offerprice: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// force: true: true-will drop the table if it already exists
offerPrice.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("OfferPrice tables synched");
    offerPrice.upsert({
        id:1,
        listing: "Iphone",
        offerprice: 10
    });
    offerPrice.upsert({
        id:2,
        listing: "Shoe",
        offerprice: 40
    });
    offerPrice.upsert({
        id:3,
        listing: "Phone",
        offerprice: 400
    });
});

module.exports = sequelize.model('offerPrice', offerPrice);