var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

// Links user_id and con_id
const seenMsg = sequelize.define('seenMsg', {
    seen_id: {
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
            model: 'Conversations',
            key: 'con_id'
        } 
    },
    seen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

seenMsg.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("seenMsg table synced");
});

module.exports = sequelize.model('seenMsg', seenMsg);