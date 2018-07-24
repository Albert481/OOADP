// models/purchase.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Purchases = sequelize.define('Purchases', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    offer_id:{
        type: Sequelize.INTEGER,
        references: {
            model: 'offerPrice',
            key: 'id'
        }
    },
    user_id:{
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'user_id'
        }
    },
    listing_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Listings',
            key: 'id'
        }
    }
});

// force: true will drop the table if it already exists
Purchases.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("purchases table synced");
    Purchases.upsert({
        id: 1,
        offer_id: 1,
        user_id: 1,
        listing_id: 2
    }),
    Purchases.upsert({
        id: 2,
        offer_id: 2,
        user_id: 1,
        listing_id: 1
    })
    // Purchases.upsert({
    //     id: 3,
    //     //offer_id: 1,
    //     user_id: 1,
    //     listing_id: 2
    // })
});

module.exports = sequelize.model('Purchases', Purchases);