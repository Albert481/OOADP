
// Import basic modules
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');
var nodemailer = require('nodemailer');

const stripe = require('stripe')('sk_test_eNcHw6TZDMbPOcBD3D9lwdSx');

//import multer
var multer = require('multer');
var upload = multer({ dest: './public/uploads/', limits: {fileSize: 1500000, files: 1} });

var myDatabase = require('./server/controllers/database');
var Sequelize = myDatabase.sequelize;
const Op = Sequelize.Op

//Import detail controller
var detail = require('./server/controllers/detail')
//Import listing controller
var listing = require('./server/controllers/listing');
// Manage Offers
var manageOffers = require("./server/controllers/manageOffers")
// Incoming Offers
var incomingOffers = require("./server/controllers/incomingOffers")
// Import home controller
var index = require('./server/controllers/index');
// Import login controller
var auth = require('./server/controllers/auth');
// Import categories controller
var category = require('./server/controllers/category');
// Import chatmessage controller
var chat = require('./server/controllers/chatmessage');
// import profile controller
var profile = require('./server/controllers/profile');
//import reviews controller
var reviews = require('./server/controllers/reviews');
//import purchase controller
var purchase = require('./server/controllers/purchase');
//import edit Imgae controller
var images = require('./server/controllers/editlistingimage');

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
    res.locals.notificount = -1;
    if (req.user != undefined) {
        SeenMsg.count({ where: {'user_id': req.user.user_id, 'seen': 0} }).then((userseen) => {
            res.locals.notificount = userseen;
            next();
        }) 
    } else {
        next();
    }
    
   });

// Index route
// app.get('/', index.show)
app.get('/login', auth.login)

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

//Profile
app.get('/profile',auth.isLoggedIn, auth.profile);
//UPDATE PROFILE
app.get('/editprofile', profile.edit);
app.post('/editprofile', profile.update);

// Logout Page
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// Serve static files TEMPORARILY
app.get('/categories', category.show)

// app.get('/chatmessage', chat.show)


// Setup chat
const io = require('socket.io')(httpServer);
var chatConnections = 0;
var ChatMsg = require('./server/models/chatMsg');
var SeenMsg = require('./server/models/seenMsg');
var ConvUsers = require('./server/models/ConvUser')

io.on('connection', function(socket) {
    chatConnections++;
    console.log("Num of socket users connected: " + chatConnections);

    socket.on('subscribe', function(room) {
        console.log('joining con_id:', room);
        socket.join(room);
    });

    socket.on('block', function(blockdata) {
        console.log('blocked user: ', blockdata);
        ConvUsers.find({where: { con_id: blockdata.con_id, cu_id: {[Op.ne] : blockdata.convuser_id} }}).then((ifBlocked) => {
            if (ifBlocked.blocked == false) {
                ConvUsers.update({blocked: true}, { where: { con_id: blockdata.con_id, cu_id: {[Op.ne] : blockdata.convuser_id} }})
            } else {
                ConvUsers.update({blocked: false}, { where: { con_id: blockdata.con_id, cu_id: {[Op.ne] : blockdata.convuser_id} }})
            }
            
        })
        
    });

    socket.on('base64 file', function (msg) {
        console.log('received base64 file from' + msg.username);
        socket.username = msg.username;
        // socket.broadcast.emit('base64 image', //exclude sender
        io.sockets.emit('base64 file',  //include sender
    
            {
              username: socket.username,
              file: msg.file,
              fileName: msg.fileName
            }
    
        );
    });

    socket.on('disconnect', function() {
        chatConnections--;
        console.log("Num of socket users connected: " + chatConnections);
    });

    socket.on('myUser', function(userRoom) {
        console.log('joining own room for notification:', 'n' + userRoom);
        socket.join('n' + userRoom);
    });

    socket.on('myCon', function(conRoom) {
        console.log('joining own con for typing:', 't' + conRoom);
        socket.join('t' + conRoom);
    });

    socket.on('typing', function(data) {
        socket.broadcast.to('t' + data.con_id).emit('istyping', {typing: data.typing, name: data.name});
    });
});

//app.use("/detail", detail.show);
app.get("/detail/:id", detail.show);
app.post("/detail/:id", detail.chat);
app.get("/", listing.list);
app.get("/listing/edit/:id", listing.editListing);
app.post("/listing/new", upload.single('image'), listing.insert);
app.post("/listing/edit/:id", listing.update);
app.delete("/listing/:id", listing.delete);
app.get("/image/:id", images.editImage);
app.post("/image/:id", upload.single('image'), images.updateImage);
app.get("/clothing", listing.clothing);
app.get("/watches", listing.watches);
app.get("/shoes", listing.shoes);
app.get("/jewellery", listing.jewellery);


app.get("/manageoffers/", manageOffers.list);
app.get("/editoffers/:id", manageOffers.editOffer)
app.post("/manageoffers/new", manageOffers.insert)
app.post("/editoffers/:id", manageOffers.update);
app.delete("/manageoffers/:id", manageOffers.delete);
app.get("/incomingoffers/", incomingOffers.list);
app.delete("/incomingoffers/:id", incomingOffers.delete);
app.post("/incomingoffers/accept/:id", incomingOffers.acceptoffer);
app.post("/incomingoffers/decline/:id", incomingOffers.declineoffer);


app.get('/messages/', chat.hasAuthorization, chat.receive);
app.get('/messages/:con_id/:cu_id', chat.hasAuthorization, chat.chatreceive);
app.post('/messages/:con_id/:cu_id', function (req, res) {
    var formattedTime = moment().format('h:mm a');
    var chatData = {
        cu_id: req.params.cu_id,
        message: req.body.message,
        timestamp: formattedTime
    }

    Sequelize.query('SELECT * FROM ConvUsers WHERE cu_id=' + req.params.cu_id, {model: ConvUsers, raw: true}).then((ifBlocked) => {
        if (ifBlocked[0].blocked == false) {
            // Save into database
            ChatMsg.create(chatData).then((newMessage) => {
                if (!newMessage) {
                    res.sendStatus(500);
                }
                // io.emit('message', chatData)
                io.in(req.params.con_id).emit('message', chatData);
                res.sendStatus(200)
            })

            // Check any unseen message existing, if yes, dont update, dont send notification
            Sequelize.query('SELECT * FROM SeenMsgs WHERE con_id=' + req.params.con_id + ' AND user_id<>' + req.user.user_id, {model: SeenMsg, raw: true}).then((ifMsgSeen) => {
                if ((ifMsgSeen[0].seen == true) || ifMsgSeen[0].seen == undefined) {
                    SeenMsg.update({seen: false}, { where: { con_id: req.params.con_id, user_id: {[Op.ne] : req.user.user_id} }})
                    Sequelize.query('SELECT * FROM SeenMsgs WHERE con_id=' + req.params.con_id + ' AND user_id<>' + req.user.user_id, {model: SeenMsg, raw:true}).then((otherUser) => {
                        io.in('n' + otherUser[0].user_id).emit('notification');
                    })
                }
                
            })
        } else {
            io.in(req.params.con_id).emit('blockmessage', chatData)
        }
    })
});

//purchase
//app.get("/purchase", purchase.show);
app.get("/purchaseinfo/:id", purchase.list);
app.post("/manageoffers", purchase.insert);

//reviews
app.get("/reviews/:id", reviews.show);
app.post("/purchaseinfo/:id", reviews.create);

// Checkout
app.post('/checkout', (req, res) => {
    console.log(req.body.amount)
    stripe.customers.create({
        email: req.body.token.stripeEmail,
        source: req.body.token.id
    }).then(customer => stripe.charges.create({
        amount: req.body.amount,
        currency: "sgd",
        description: "myShoppe Purchase",
        customer: customer.id
    })).then(charge => console.log('Payment success'));
    
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

// app.get('/listing', listing.hasAuthorization, listing.show);
// app.post('/listing-gallery', listing.hasAuthorization, listing.create);
// app.delete('/listing/:listing_id', listing.hasAuthorization, listing.delete);


module.exports = app;

app.set('port', serverPort);

app.set('view engine', 'ejs');

var server = httpServer.listen(app.get('port'), function (){
    console.log('http server running on port ' + server.address().port);
});
