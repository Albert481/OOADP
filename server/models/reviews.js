// models/reviews.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Reviews = sequelize.define('Reviews', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    satisfaction: {
        type: Sequelize.STRING,
        defaultValue: ''
    },
    content: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
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
    },
    purchase_id:{
        type: Sequelize.INTEGER,
        references: {
            model: 'Purchases',
            key: 'id'
        }        
    }
});

// force: true will drop the table if it already exists
Reviews.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("reviews table synced");

});

module.exports = sequelize.model('Reviews', Reviews);