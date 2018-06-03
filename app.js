
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


// Modules to store session
var myDatabase = require('./server/controllers/database');
var expressSession = require('express-session');
var SessionStore = require('express-session-sequelize')(expressSession.Store);
var sequelizeSessionStore = new SessionStore({
    db: myDatabase.sequelize,
});

// Setup routes


// Setup chat
var io = require('socket.io')(httpServer);


// Static files


module.exports = app;

app.set('port', serverPort);

var server = httpServer.listen(app.get('port'), function (){
    console.log('http server running on port' + server.address().port);
});