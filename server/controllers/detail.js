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

exports.chat = function (req, res) {
    sequelize.query('SELECT l.id, l.user_id, l.name, l.imagename FROM Listings l WHERE l.id=' + req.params.id, { model: Conversation, model: ListingModel, raw: true }).then((convo) => {
        var data = { title: convo[0].name, imagename: convo[0].imagename }

        // Finds if user already have existing conversation
        sequelize.query('SELECT con_id FROM Conversations WHERE title=\'' + convo[0].name + '\' AND imagename=\'' + convo[0].imagename + '\'', { model: Conversation, raw: true }).then(findConExist => {
            // Create new Conversation if not found
            if (findConExist[0] == null) {
                Conversation.create(data).then((newConvo => {
                    // Create new ConvUser for sender
                    ConvUser.findOrCreate({
                        where: { user_id: req.user.user_id, con_id: newConvo.con_id },
                    }).spread(function (match, created) {
                        // Find cu_id
                        ConvUser.findOne({ where: { user_id: req.user.user_id, con_id: newConvo.con_id }, raw: true }).then(findKeyConv => {
                            res.redirect('/messages/' + findKeyConv.con_id + '/' + findKeyConv.cu_id)
                        })
                    });
                    // Create new ConvUser for receiver
                    ConvUser.findOrCreate({
                        where: { user_id: convo[0].user_id, con_id: newConvo.con_id },
                    }).spread(function (match, created) {
                    })
                    
                }))
            } else {
            // If the conversation is found
                sequelize.query('SELECT cu_id FROM ConvUsers WHERE user_id=\'' + req.user.user_id + '\' AND con_id=\'' + findConExist[0].con_id + '\'', { model: ConvUser, raw: true }).then(findConvExist => {
                    if(findConvExist[0]==null) {
                        Conversation.create(data).then((newConvo => {
                            // Create new ConvUser for sender
                            ConvUser.findOrCreate({
                                where: { user_id: req.user.user_id, con_id: newConvo.con_id },
                            }).spread(function (match, created) {
                                // Find cu_id
                                ConvUser.findOne({ where: { user_id: req.user.user_id, con_id: newConvo.con_id }, raw: true }).then(findKeyConv => {
                                    res.redirect('/messages/' + findKeyConv.con_id + '/' + findKeyConv.cu_id)
                                })
                            });
                            // Create new ConvUser for receiver
                            ConvUser.findOrCreate({
                                where: { user_id: convo[0].user_id, con_id: newConvo.con_id },
                            }).spread(function (match, created) {
                            })
                            
                        }))
                    } else {
                        console.log(findConvExist)
                        var con_id = findConExist[0].con_id;
                        var cu_id = findConvExist[0].cu_id;
                        res.redirect('/messages/' + con_id + '/' + cu_id)
                    }
                    
                })
            }
            
        })




    })
}

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