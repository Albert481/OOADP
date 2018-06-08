
// Import basic modules
var express = require('express');
var path = require('path');
var logger = require('morgan');
var socket = require('socket.io');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Import home controller
var index = require('./server/controllers/index');
// Import login controller
var auth = require('./server/controllers/auth');
// Import categories controller
var category = require('./server/controllers/category');
// Import chatmessage controller
var chat = require('./server/controllers/chatmessage');

// Modules to store session
var myDatabase = require('./server/controllers/database');
var expressSession = require('express-session');
var SessionStore = require('express-session-sequelize')(expressSession.Store);
var sequelizeSessionStore = new SessionStore({
    db: myDatabase.sequelize,
});

// Import Passport and Warning flash modules
var passport = require('passport');
var flash = require('connect-flash');

// App setup
var app = express();
var serverPort = 3000;
var httpServer = require('http').Server(app);

// view engine setup
app.set('views', path.join(__dirname, 'server/views/pages'));
app.set('view engine', 'ejs');

// Passport configuration
require('./server/config/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));

// Setup public directory
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// secret for session
app.use(expressSession({
    secret: 'sometextgohere',
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false,
}));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// flash messages
app.use(flash());

// Application Routes
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
  });

// Index route
app.get('/', index.show)
app.get('/login', auth.login)

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

// Logout Page
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// Serve static files TEMPORARILY
app.get('/categories', category.show)

// app.get('/chatmessage', chat.show)

// Setup chat
var io = require('socket.io')(httpServer);
var chatConnections = 0;
var ChatMsg = require('./server/models/chatMsg');
var User = require('./server/models/users')

io.on('connection', function(socket) {
    chatConnections++;
    console.log("Num of chat users connected: " + chatConnections);

    socket.on('disconnect', function() {
        chatConnections--;
        console.log("Num of chat users connected: " + chatConnections);

    });
})

app.get('/messages', function(req, res) {
    ChatMsg.findAll().then((chatMessages) => {
        User.findAll().then((users) => {
            res.render('chatMsg', {
                title: 'myShoppe',
                url: req.protocol + "://" + req.get("host") + req.url,
                data: chatMessages,
                userchannel: users
            })
        });
    });
});

app.post('/messages', function (req, res) {
    var datetime = new Date();
    var chatData = {
        name: req.user.name,
        message: req.body.message,
        timestamp: datetime.getHours() + ":" + datetime.getMinutes()
    }
    // Save into database
    ChatMsg.create(chatData).then((newMessage) => {
        if (!newMessage) {
            res.sendStatus(500);
        }
        io.emit('message', chatData)
        res.sendStatus(200)
    })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

app.set('port', serverPort);

app.set('view engine', 'ejs');

var server = httpServer.listen(app.get('port'), function (){
    console.log('http server running on port ' + server.address().port);
});