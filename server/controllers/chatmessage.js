var users = require('../models/users')
var chatMsg = require('../models/chatMsg');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.receive = function(req, res) {
    if (req.params.con_id == null){
        con_id = 0
    } else {
        con_id = req.params.con_id
    }
    sequelize.query('SELECT cu.cu_id, cu.con_id, cu.user_id, u.name FROM Conversations con INNER JOIN ConvUsers cu ON con.con_id=cu.con_id INNER JOIN Users u ON u.user_id=cu.user_id INNER JOIN ChatMsgs cm ON cu.cu_id=cm.cu_id', { model: chatMsg , model: users, raw: true} ).then((convo) => {
        sequelize.query('SELECT cm.msg_id, cu.cu_id, cu.user_id, u.name ,con.con_id, con.title, cm.message, cm.timestamp FROM Conversations con INNER JOIN ConvUsers cu ON con.con_id=cu.con_id INNER JOIN Users u ON u.user_id=cu.user_id INNER JOIN ChatMsgs cm ON cu.cu_id=cm.cu_id WHERE con.con_id=' + con_id + 'ORDER BY cm.timestamp', { model: chatMsg , model: users, raw: true} ).then((chats) => {
            res.render('chatMsg', {
                title: 'myShoppe',
                chatmessages: chats,
                conversations: convo,
                urlPath: req.protocol + "://" + req.get("host") + req.path
            })
        }).catch((err) => {
            return res.status(400).send({
                message: err
            });
        });
    });
};
