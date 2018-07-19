// get gravatar icon from email
var gravatar = require('gravatar');
var passport = require('passport');
var ListingModel = require('../models/ListingModel');
var myDatabase = require('./database')
var sequelize = myDatabase.sequelize;

// Login GET
exports.login = function(req, res) {
    // List all Users and sort by Date
    res.render('login', { title: 'Login Page', message: req.flash('loginMessage') });
};
// // Signup GET
// exports.signup = function(req, res) {
//     // List all Users and sort by Date
//     res.render('signup', { title: 'Signup Page', message: req.flash('signupMessage') });

// };
// Profile GET
exports.profile = function(req, res) {
    sequelize.query('select u.user_id, l.id, l.user_id, l.name, l.imagename, l.description, l.price, l.status from Users u join Listings l on l.user_id = u.user_id', {model : ListingModel}).then ((listings) =>{
    // List all Users and sort by Date
    res.render('profile', { title: 'Profile Page', user : req.user, itemList : listings, avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'}, true) });
    })
};
// Logout function
exports.logout = function () {
    req.logout();
    res.redirect('/');
};

// check if user is logged in
exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
