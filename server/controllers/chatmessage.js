var express = require('express');
var ChatMsg = require('../models/chatMsg');
var Conversation = require('../models/conversation')
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

// exports.receive = function(req, res) {
//     Conversation.findAll().then((conversations) => {
//         ChatMsg.findAll().then((chatMessages) => {
//             User.findAll().then((users) => {
//                 res.render('chatMsg', {
//                     title: 'myShoppe',
//                     conversations: conversations,
//                     chatmessages: chatMessages,
//                     urlPath: req.protocol + "://" + req.get("host") + req.path
//                 })
//             });
//         });
//     });
// };

exports.receive = function(req, res) {
    if (req.params.con_id == null){
        con_id = 0
    } else {
        con_id = req.params.con_id
    }
    Conversation.findAll().then((conversations) => {
        sequelize.query('select msg.conversation_id, msg.senderid, msg.recipientid, msg.message, msg.timestamp from ChatMsgs msg where msg.conversation_id =' + con_id, { model: ChatMsg} ).then((chats) => {
            res.render('chatMsg', {
                title: 'myShoppe',
                chatmessages: chats,
                conversations: conversations,
                urlPath: req.protocol + "://" + req.get("host") + req.path
            });
        }).catch((err) => {
            return res.status(400).send({
                message: err
            });
        });
    })
};
