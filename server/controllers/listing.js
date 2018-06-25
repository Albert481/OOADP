var ListingModel = require('../models/ListingModel');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

//Add a new listing to database
exports.insert = function (req, res){
    var listingData = {
        listingId: req.body.listingId,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }
    ListingModel.create(listingData).then((newRecord, created) => {
        if (!newRecord){
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/listing');
    })
};
//list listing
exports.list = function (req, res){
    ListingModel.findAll({
        attributes: ['id', 'listingId', 'name', 'description', 'price']
    }).then(function (listings) {
        res.render('listing', {
            title: "Listing",
            itemList: listings,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

//Edit one listing
exports.editListing = function(req,res){
    var listing_num = req.params.id;
    StudentModel.findById(listing_num).then(function (listingRecord) {
        res.render('editListing', {
            title: "Edit Listing",
            item: listingRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((er) => {
        return res.status(400).send({
            message:err
        });
    });
};

//Update listing
exports.update = function (req, res) {
    var listing_num = req.params.id;
    var updateListing = {
        listingId: req.body.listingId,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }
    StudentModel.update(updateListing, {where: {id: listing_num} }).then((updateRecord) => {
        if (!updateRecord || updateRecord == 0){
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({message: "Updates listing:" + listing_num});
    })
}

//Delete a listing record from database
exports.delete = function (req, res){
    var listing_num = req.params.id;
    console.log("deleting" + listing_num);
   ListingModel.destroy({ where: {id: listing_num } }).then((deletedListing) =>{
        if (!deletedListing){
            return res.send(400, {
                message: "error"       
            });
        }
        res.status(200).send({message: "Deleted listing:" + listing_num});
    });
}