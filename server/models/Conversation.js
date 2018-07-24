var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

// Room ID
const Conversation = sequelize.define('Conversation', {
    con_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    imagename:{
        type: Sequelize.STRING
    }
});

Conversation.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("Conversation table synced");
});

module.exports = sequelize.model('Conversation', Conversation);
