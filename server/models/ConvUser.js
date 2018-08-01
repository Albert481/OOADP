var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

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
            model: 'Conversations',
            key: 'con_id'
        } 
    },
    blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

ConvUser.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("ConvUser table synced");
});

module.exports = sequelize.model('ConvUser', ConvUser);