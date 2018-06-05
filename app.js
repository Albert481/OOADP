
// Import basic modules
var express = require('express');
var path = require('path');
var socket = require('socket.io');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Import Passport and Warning flash modules
var passport = require('passport');

// App setup
var app = express();
var io = socket();
var serverPort = 3000;
var httpServer = require('http').Server(app);

// Import home controller
var index = require('./server/controllers/index');
// Import login controller
var auth = require('./server/controllers/auth');


// view engine setup
app.set('views', path.join(__dirname, 'server/views/pages'));
app.set('view engine', 'ejs');

// Passport configuration
require('./server/config/passport')(passport);

// Setup public directory
app.use(express.static(path.join(__dirname, 'public')));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

// Modules to store session
var myDatabase = require('./server/controllers/database');
var expressSession = require('express-session');
var SessionStore = require('express-session-sequelize')(expressSession.Store);
var sequelizeSessionStore = new SessionStore({
    db: myDatabase.sequelize,
});

// Application Routes
// Index route
app.get('/', index.show)
app.get('/login', auth.signin)

app.post('/login', passport.authenticate('local-login', {
    //Success go to Profile Page / Fail go to login page
    successRedirect: '/profile',
    failureRedirect: '/login',

}));
app.post('/signup', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    successRedirect: '/profile',
    failureRedirect: '/login',
    
}));

// Logout Page
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


// Setup chat
var io = require('socket.io')(httpServer);


module.exports = app;

app.set('port', serverPort);

app.set('view engine', 'ejs');

var server = httpServer.listen(app.get('port'), function (){
    console.log('http server running on port ' + server.address().port);
});