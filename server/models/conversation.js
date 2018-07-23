var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Conversation = sequelize.define('Conversation', {
    con_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    senderid: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    recipientid: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        } 
    }
});

Conversation.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("Conversation table synced");
    Conversation.upsert({
        con_id: '1',
        senderid: '1',
        recipientid: '2'
    }); 
    Conversation.upsert({
        con_id: '2',
        senderid: '1',
        recipientid: '3'
    })
});

module.exports = sequelize.model('Conversation', Conversation)