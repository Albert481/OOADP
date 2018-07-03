var offerPrice = require('../models/offerPrice');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

// Add an offer record top database
exports.insert = function (req, res) {
    var offerData = {
        offerId: req.body.offerId,
        listing: req.body.listing,
        offerprice: req.body.offerprice
    }
    offerPrice.create(offerData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/');
    })
};

// List all the offer records in database
exports.list = function (req, res) {
    offerPrice.findAll({raw: true
    }).then(function (offer) {
        res.render('manageOffers', {
            title: "Manage Offers",
            itemList: offer,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

// List one specific offer record from database
exports.manageOffers = function (req, res) {
    var record_num = req.params.id;
    offerPrice.findById(record_num).then(function (offerRecord) {
        res.render('manageOffers', {
            title: "Manage Offer",
            item: offerRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

// List one specific student record from database
exports.editOffer = function (req, res) {
    var record_num = req.params.id;
    offerPrice.findById(record_num).then(function (offerRecord) {
        res.render('editOffers', {
            title: "Edit Offer",
            item: offerRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

//Update offer record in database
exports.update = function (req, res) {
    var record_num = req.params.id;
    var updateData = {
        offerId: req.body.offerId,
        listing: req.body.listing,
        offerprice: req.body.offerprice
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

//Delete a student record from database
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