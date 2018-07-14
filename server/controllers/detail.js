var ListingModel = require('../models/ListingModel');
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