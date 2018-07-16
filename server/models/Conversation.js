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
    Conversation.upsert({
        con_id: '1',
        title: 'Vans Old Skool - Size 10.0 Men',
        imagename: 'vans.jpg'
    }); 
    Conversation.upsert({
        con_id: '2',
        title: 'YEEZY 500 “Super Moon Yellow”',
        imagename: 'yeezy.jpg'
    })
});

module.exports = sequelize.model('Conversation', Conversation);