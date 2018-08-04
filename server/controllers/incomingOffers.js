var offerPrice = require('../models/offerPrice');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

// Add an offer record top database
exports.insert = function (req, res) {
    var offerData = {
        user_id: req.user.user_id,
        listing_id: req.body.listing_id,
        offerprice: req.body.offerprice
    }
    offerPrice.create(offerData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/manageoffers');
    })
};

// List all the offer records in database
exports.list = function (req, res) {
    var user_id = req.user.user_id;
    sequelize.query('SELECT o.id, o.offerprice, l.name AS itemname, b.name AS buyername, offerstatus FROM OfferPrices o INNER JOIN Listings l ON o.listing_id = l.id INNER JOIN users b ON b.user_id = o.user_id WHERE l.user_id =' + user_id, { model: offerPrice, raw: true}).then((offer) => {
        
        res.render('incomingOffers', {
            title: "Incoming Offers",
            itemList: offer,
            notifi_id: res.notifi_id,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        })
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

// List one specific offer record from database
exports.incomingOffers = function (req, res) {
    var record_num = req.params.id;
    offerPrice.findById(record_num).then(function (offerRecord) {
        res.render('incomingOffers', {
            title: "Incoming Offer",
            item: offerRecord,
            notifi_id: res.notifi_id,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

// List one specific offer record from database
exports.editOffer = function (req, res) {
    var record_num = req.params.id;
    offerPrice.findById(record_num).then(function (offerRecord) {
        res.render('editOffers', {
            title: "Edit Offer",
            item: offerRecord,
            notifi_id: res.notifi_id,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

//Accept Offer
exports.acceptoffer = function (req, res) {
    var record_num = req.params.id;
    var updateData = {
        offerstatus: "Accepted"
    }
    offerPrice.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
        if (!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated offer record:" + record_num });
    })
}

//Decline Offer
exports.declineoffer = function (req, res) {
    var record_num = req.params.id;
    var updateData = {
        offerstatus: "Declined"
    }
    offerPrice.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
        if (!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated offer record:" + record_num });
    })
}

//Delete an offer from database
exports.delete = function (req, res) {
    var record_num = req.params.id;
    console.log("deleting" + record_num);
    offerPrice.destroy({ where: { id: record_num } }).then((deletedRecord) => {
        if(!deletedRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted offer record:" + record_num});
    });
}

exports.hasAuthorization = function (req, res, next) {
    if(req.isAuthenticated())
        res.notifi_id = req.user.user_id
        return next();
    res.redirect('/login');
};