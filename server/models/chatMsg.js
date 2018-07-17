// models/chatMsg.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const ChatMsg = sequelize.define('ChatMsg', {
    msg_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cu_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'ConvUsers',
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



// force: true will drop the table if it already exists
ChatMsg.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("ChatMsg table synced");
});

module.exports = sequelize.model('ChatMsg', ChatMsg);
