// models/purchase.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Purchase =  sequelize.define('Purchase', {
    purchase_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    listing_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Listings',
            key: 'id'
            }
    },        
});

// force: true will drop the table if it already exists
Purchase.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("purchase table synced");
    Purchase.upsert({
        purchase_id: 1,
        user_id: 1,
        listing_id: 2
    })
});

module.exports = sequelize.model('Purchase', Purchase);
