var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;
var ListingModel = require('../models/ListingModel');
var Conversation = require('../models/Conversation');
var ConvUser = require('../models/ConvUser');
var myDatabase = require('./database');

// exports.show = function(req, res) {
// 	// Render home screen
// 	res.render('detail', {
// 		title: 'detail',
// 		callToAction: 'ITP211'
//     });
// };
exports.show = function (req, res){
    var listing_num = req.params.id;
    ListingModel.findById(listing_num).then(function (listings) {
//        attributes: ['id', 'user_id', 'name', 'imagename', 'description', 'price', 'status']
//    }).then(function (listings) {
        res.render('detail', {
            title: "Detail",
            itemList: listings,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

exports.chat = function (req, res){
    sequelize.query('SELECT l.id, l.user_id, l.name, l.imagename FROM Listings l WHERE l.id=' + req.params.id, { model: Conversation , model: ListingModel, raw: true} ).then((convo) => {
        var con_id;
        // Create new Conversation if not found
        Conversation.findOrCreate({
            where: {title: convo[0].name, imagename: convo[0].imagename},
            }).spread(function(match, created) {
        });
        Conversation.findOne({ where: {title: convo[0].name, imagename: convo[0].imagename}, raw: true }).then(findKey => {
            // Create new ConvUser
            ConvUser.findOrCreate({
                where: {user_id: req.user.user_id, con_id: findKey.con_id},
                }).spread(function(match, created) {
                    // Find cu_id
                    ConvUser.findOne({ where: {user_id: req.user.user_id, con_id: findKey.con_id}, raw: true }).then(findKeyConv => {
                        res.redirect('/messages/' + con_id + '/' + findKeyConv.cu_id)
                    })
            });
            ConvUser.findOrCreate({
                where: {user_id: convo[0].user_id, con_id: findKey.con_id},
            }).spread(function(match, created) {
            })
        })        
    });
};
// exports.show = function (req, res) {
//     var listing_num = req.user.id;
//     ListingModel.findAll({
//         attributes: ['id', 'user_id', 'name', 'imagename', 'description', 'price', 'status']
//     }).then(function(listings){
//         res.render('detail', {
//             title: "Detail",
//             itemList: listings,
//             urlPath: req.protocol + "://" + req.get("host") + req.url
//         })
//     })
// }