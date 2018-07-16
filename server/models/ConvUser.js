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
    }
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

module.exports = sequelize.model('ConvUser', ConvUser);