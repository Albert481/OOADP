// models/images.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Listing = sequelize.define('Listing', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    imageName: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false

    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

// force: true will drop the table if it already exists
Listing.sync({ force: true, logging: console.log}).then(() => {
    // Table created
    console.log("listing table synced");
    return Listing.upsert({
        id: 6,
        created: 2018-07-14,
        title: "First Listing",
        imageName:  "No image",
        description: "THIS IS THE FIRST LISTING",
        price: 1.00,
        user_id: 6

    })
});

module.exports = sequelize.model('Listing', Listing);
