var express = require('express');
var app = express();
var ChatMsg = require('../models/chatMsg');
var Conversation = require('../models/conversation')
var User = require('../models/users')
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);

exports.receive = function(req, res) {
    Conversation.findAll().then((conversations) => {
        ChatMsg.findAll().then((chatMessages) => {
            User.findAll().then((users) => {
                res.render('chatMsg', {
                    title: 'myShoppe',
                    conversations: conversations,
                    chatmessages: chatMessages,
                    userbase: users,
                    urlPath: req.protocol + "://" + req.get("host") + req.path
                })
            });
        });
    });
};

