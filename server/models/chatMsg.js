// models/chatMsg.js
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
    }
});

// Links user_id and con_id
const ConvUser = sequelize.define('ConvUser', {
    cu_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'user_id'
        }
    },
    con_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Conversation,
            key: 'con_id'
        } 
    }
});

const ChatMsg = sequelize.define('ChatMsg', {
    msg_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cu_id: {
        type: Sequelize.INTEGER,
        references: {
            model: ConvUser,
            key: 'cu_id'
        }
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    timestamp: {
        type: Sequelize.STRING,
        allowNull: true,
    }
});

Conversation.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("Conversation table synced");
    Conversation.upsert({
        con_id: '1',
        title: 'My garage band'
    }); 
    Conversation.upsert({
        con_id: '2',
        title: 'my weeaboo toy'
    })
});

ConvUser.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("ConvUser table synced");
    ConvUser.upsert({
        cu_id: '1',
        user_id: '1',
        con_id: '1'
    }); 
    ConvUser.upsert({
        cu_id: '2',
        user_id: '2',
        con_id: '1'
    }); 
    ConvUser.upsert({
        cu_id: '3',
        user_id: '1',
        con_id: '2'
    }); 
    ConvUser.upsert({
        cu_id: '4',
        user_id: '2',
        con_id: '2'
    }); 
});

// force: true will drop the table if it already exists
ChatMsg.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("ChatMsg table synced");
    ChatMsg.upsert({
        msg_id: '1',
        cu_id: '1',
        message: 'Hello Aaron',
        timestamp: '00:00 AM'
    })
    ChatMsg.upsert({
        msg_id: '2',
        cu_id: '2',
        message: 'Hello Albert',
        timestamp: '00:01 AM'
    })
    ChatMsg.upsert({
        msg_id: '3',
        cu_id: '3',
        message: 'Waddup Aaron',
        timestamp: '01:00 AM'
    })
    ChatMsg.upsert({
        msg_id: '4',
        cu_id: '4',
        message: 'Waddup Albert',
        timestamp: '01:01 AM'
    })
});

module.exports = sequelize.model('Conversation', Conversation);
module.exports = sequelize.model('ConvUser', ConvUser);
module.exports = sequelize.model('ChatMsg', ChatMsg);