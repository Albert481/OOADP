// get gravatar icon from email
var gravatar = require('gravatar');
var passport = require('passport');

// Login GET
exports.login = function(req, res) {
    // List all Users and sort by Date
    res.render('login', { title: 'Login Page', notifi_id: -1, message: req.flash('loginMessage') });
};
// // Signup GET
// exports.signup = function(req, res) {
//     // List all Users and sort by Date
//     res.render('signup', { title: 'Signup Page', message: req.flash('signupMessage') });

// };
// Profile GET
exports.profile = function(req, res) {
    // List all Users and sort by Date
    res.render('profile', { title: 'Profile Page', user : req.user, notifi_id: req.notifi_id, avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'}, true) });
};
// Logout function
exports.logout = function () {
    req.logout();
    res.redirect('/');
};

// check if user is logged in
exports.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated())
        req.notifi_id = req.user.user_id
        return next();
    res.redirect('/login');
};
