// models/purchase.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Purchase =  sequelize.define('Purchase', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
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
    offer_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'offerPrices',
            key: 'id'
        }
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'new'
    }
});

// force: true will drop the table if it already exists
Purchase.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("purchase table synced");
    
});

module.exports = sequelize.model('Purchase', Purchase);