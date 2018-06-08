var express = require('express');
var app = express();
var ChatMsg = require('../models/chatMsg');
var User = require('../models/users')
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);

exports.receive = function(req, res) {
	ChatMsg.findAll().then((chatMessages) => {
        User.findAll().then((users) => {
            res.render('chatMsg', {
                title: 'myShoppe',
                data: chatMessages,
				userchannel: users,
                urlPath: req.protocol + "://" + req.get("host") + req.url
            })
        });
    });
};

