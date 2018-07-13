// // models/chatMsg.js
// var myDatabase = require('../controllers/database');
// var sequelize = myDatabase.sequelize;
// var Sequelize = myDatabase.Sequelize;

// const ChatMsg = sequelize.define('ChatMsg', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     conversation_id: {
//         type: Sequelize.INTEGER,
//         // references: {
//         //     model: 'conversation',
//         //     key: 'con_id'
//         // }
//     },
//     senderid: {
//         type: Sequelize.INTEGER
//     },
//     recipientid: {
//         type: Sequelize.INTEGER   
//     },
//     message: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         defaultValue: '',
//         trim: true
//     },
//     timestamp: {
//         type: Sequelize.STRING,
//         allowNull: true,
//     }
// });

// // force: true will drop the table if it already exists
// ChatMsg.sync({ force: false, logging: console.log}).then(() => {
//     // Table created
//     console.log("ChatMsg table synced");
//     ChatMsg.upsert({
//         id: '1',
//         conversation_id: '1',
//         senderid: '1',
//         recipientid: '2',
//         message: 'Hello World',
//         timestamp: '00:00 AM'
//     })
// });

// module.exports = sequelize.model('ChatMsg', ChatMsg);