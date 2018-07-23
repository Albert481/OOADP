var users = require('../models/users');
var chatMsg = require('../models/chatMsg');
var SeenMsg = require('../models/seenMsg');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;
// get gravatar icon from email
var gravatar = require('gravatar');


// Default controller for /messages/
exports.receive = function(req, res) {
    sequelize.query('SELECT cu.cu_id, cu.con_id, cu.user_id, u.name, con.title, con.imagename FROM Conversations con INNER JOIN ConvUsers cu ON con.con_id=cu.con_id INNER JOIN Users u ON u.user_id=cu.user_id', { model: chatMsg , model: users, raw: true} ).then((convo) => {
        res.render('chatMsg', {
            title: 'myShoppe',
            conversations: convo,
            con_id: 0,
            cu_id: 0,
            notifi_id: res.notifi_id,
            avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'}, true),
            gravatar: gravatar,
            urlPath: req.protocol + "://" + req.get("host") + req.path
        })
    })
};

// Controller for /messages/:con_id/:cu_id
exports.chatreceive = function(req, res) {
    if (req.params.con_id == null){
        con_id = 0
    } else {
        con_id = req.params.con_id
    }
    sequelize.query('SELECT cu.cu_id, cu.con_id, cu.user_id, u.name, u.email, con.title, con.imagename FROM Conversations con INNER JOIN ConvUsers cu ON con.con_id=cu.con_id INNER JOIN Users u ON u.user_id=cu.user_id', { model: chatMsg , model: users, raw: true} ).then((convo) => {
        sequelize.query('SELECT cm.msg_id, cu.cu_id, cu.user_id, u.name, con.con_id, con.title, cm.message, cm.timestamp FROM Conversations con INNER JOIN ConvUsers cu ON con.con_id=cu.con_id INNER JOIN Users u ON u.user_id=cu.user_id INNER JOIN ChatMsgs cm ON cu.cu_id=cm.cu_id WHERE con.con_id=' + con_id + 'ORDER BY cm.timestamp', { model: chatMsg , model: users, raw: true} ).then((chats) => {
            
            res.render('chatMsg', {
                title: 'myShoppe',
                chatmessages: chats,
                conversations: convo,
                con_id: req.params.con_id,
                cu_id: req.params.cu_id,
                notifi_id: res.notifi_id,
                avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'}, true),
                gravatar: gravatar,
                urlPath: req.protocol + "://" + req.get("host") + req.path
            })
        }).catch((err) => {
            return res.status(400).send({
                message: err
            });
        });
    });
    var seenData = {
        seen: true
    }
    SeenMsg.update(seenData, { where: { user_id: req.user.user_id, con_id: req.params.con_id} })
};

//ChatMsg authorization middleware
exports.hasAuthorization = function (req, res, next) {
    if(req.isAuthenticated())
        res.notifi_id = req.user.user_id
        return next();
    res.redirect('/login');
};
