
// Import basic modules
var express = require('express');
var path = require('path');
var socket = require('socket.io');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// App setup
var app = express();
var io = socket();
var serverPort = 3000;
var httpServer = require('http').Server(app);

// Import controllers


// Setup routes


// Setup chat
var io = require('socket.io')(httpServer);


// Static files


app.set('port', serverPort);

var server = httpServer.listen(app.get('port'), function (){
    console.log('http server running on port' + server.address().port);
});