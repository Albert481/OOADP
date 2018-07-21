var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;
var ListingModel = require('../models/ListingModel');
var Conversation = require('../models/Conversation');
var ConvUser = require('../models/ConvUser');
var myDatabase = require('./database');
var Users = require('../models/users');
var gravatar = require('gravatar');
//var offerPrice = require('../models/offerPrice');

exports.show = function (req, res){
    var listing_num = req.params.id;
    //ListingModel.findById(listing_num).then(function (listings) {
    //    res.render('detail', {
    //        title: "Detail",
    //        itemList: listings
    //    });
    //}).catch((err) => {
    //    return res.status(400).send({
    //        message: err
    //    });
    //});
    ListingModel.findAll({
        where: {
            id : listing_num
        }
    }).then(function(listings) {
        Users.findAll({
            where : {
                user_id : listings[0].user_id
            }
        }).then(function(user_info) {
        // offerPrice.findAll({
        //     where: {
        //         listing_id: listings[0].id
        //     }
        // }).then(function(priceOffer) {
            res.render('detail', {
                title:"Detail",
                itemList: listings[0],
                user: user_info[0],
   //             offeredPrice: priceOffer[0],
                gravatar: gravatar.url(user_info[0].email,  {s: '100', r: 'x', d: 'retro'}, true),
            })
        })
    })
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