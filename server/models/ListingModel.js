var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const ListingModel = sequelize.define('Listings', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    listingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
            model: 'Users',
            key: 'id'
        }
    },
    name: {
        type: Sequelize.STRING,
        trim: true
    },
    description: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        trim: true
    }
});
//force: true will drop the table if its already exists
ListingModel.sync({force: false, logging: console.log}).then(() => {
    //Table created
    console.log("Listings table synced");
    ListingModel.upsert({
        id:1,
        listingId: 1,
        name: "Vans Old Skool - Size 10.0 Men",
        description: "Vans The Old Skool, Vans classic skate shoe and the first to bare the iconic side stripe, has a low-top lace-up silhouette with a durable suede and canvas upper with padded tongue and lining and Vans signature Waffle Outsole.",
        price: 60.00
    });
    ListingModel.upsert({
        id:2,
        listingId: 2,
        name: "YEEZY 500 “Super Moon Yellow”",
        description: "Yeezy 500 Super Moon Yellow features an upper constructed from cow suede, premium leather and mesh with nubuck accents with other highlights including a sculpted, thick textured sole with Adidas branding on the side, reflective piping details around the lace that can light up to add visibility in low-light conditions, and the lightweight, Adiprene+ Cushioning that helps absorbs shock at impact.",
        price: 320.00
    });
});

module.exports = sequelize.model('Listings', ListingModel)