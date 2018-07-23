// get gravatar icon from email
// get reviews model
var Purchases = require('../models/purchase');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;
var user = require('../models/users');
//List All Purchases
exports.show = function (req, res){
    //List all reviews and sort by Date
    sequelize.query('select p.id, l.id AS [listing_id], o.id as [offer_id] from Purchases p join Listings l on p.listing_id = l.id join offerPrices o on p.offer_id = o.id', {model: Purchases}).then((purchase) => {
        res.render('purchase', {
            title: 'Purchase History',
            purchase: purchase,
            user: user,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        })
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};


//list one Purchase
exports.list = function (req, res) {
    var purchase_num = req.params.id;
    Purchases.findById(purchase_num).then(function(purchaseRec){
        res.render('purchaseinfo', {
            title: 'Purchase Info',
            purchase: purchaseRec,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};