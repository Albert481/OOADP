// models/users.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Users = sequelize.define('Users', {
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    bio: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    address: {
        type: Sequelize.STRING,
        defaultValue: ""
    }
});

// force: true will drop the table if it already exists
Users.sync({force: false, logging:console.log}).then(()=>{
    console.log("users table synced");
    Users.upsert({
        user_id: 1,
        name: 'Albert',
        email: 'albert@gmail.com',
        password: '1234',
        bio: "selling shoes",
        address: "Hougang 1"
    })
    Users.upsert({
        user_id: 2,
        name: 'Aaron',
        email: 'aaron@gmail.com',
        password: '1234',
        bio: "selling shoes",
        address: "Hougang 1"
    })
    Users.upsert({
        user_id: 3,
        name: 'angelica',
        email: 'angelica@gmail.com',
        password: '1234',
        bio: "selling shoes",
        address: "Hougang 1"
    })
    Users.upsert({
        user_id: 4,
        name: 'jingxin',
        email: 'jingxin@gmail.com',
        password: '1234',
        bio: "selling shoes",
        address: "Hougang 1"
    })
    Users.upsert({
        user_id: 5,
        name: 'hamizan',
        email: 'hamizan@gmail.com',
        password: '1234',
        bio: "selling shoes",
        address: "Hougang 1"
    })
});

module.exports = sequelize.model('Users', Users);