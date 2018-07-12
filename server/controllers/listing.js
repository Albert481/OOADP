var ListingModel = require('../models/ListingModel');
var myDatabase = require('./database');
var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');
//set image file types
var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
var Images = require('../models/ListingModel');
var sequelize = myDatabase.sequelize;
//var upload = multer({ dest: '././public/images/listingimages' })

//Add a new listing to database
exports.insert = function (req, res){
    var src;
    var dest;
    var targetPath;
    var targetName;
    var tempPath = req.file.path;
    console.log(req.file);
    // get the mime type of the file
    var type = mime.lookup(req.file.mimetype);
    //get file extension
    var extension = req.file.path.split(/[. ]+/).pop();
    //check support file types
    if (IMAGE_TYPES.indexOf(type) == -1){
        return res.status(415).send('Supported image format: jpeg, jpg, jpe, png.');
    }
    //Set new path to images
    targetPath = './public/images/listingimages/' + req.file.originalname;
    //using read stream API to read file
    src = fs.createReadStream(tempPath);
    //using a write stream API to write file
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);

    // Show error
    src.on('error', function (err) {
        if (err){
            return res.status(500).send({
                message: error
            });
        }
    });

    //Save file process
    src.on('end', function() {
        //create a new instance of the model with request body
    var listingData = {
        user_id: req.body.user_id,
        name: req.body.name,
        imagename: req.file.originalname,
        description: req.body.description,
        price: req.body.price,
        status: req.body.status,
    }
    ListingModel.create(listingData).then((newRecord, created) => {
        if (!newRecord){
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/listing');
    })

    //remove from temp folder
    fs.unlink(tempPath, function (err) {
        if (err) {
            return res.status(500).send('Error');
        }
        //Redirect to listing's page
        res.redirect('/listing');
    });
});
};
//list listing
exports.list = function (req, res){
    ListingModel.findAll({
        attributes: ['id', 'user_id', 'name', 'imagename', 'description', 'price', 'status']
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
    var listing_num = req.params.listing_id;
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
    var listing_num = req.params.listing_id;
    var updateListing = {
        user_id: req.body.user_id,
        name: req.body.name,
        imagename: req.file.originalname,
        description: req.body.description,
        price: req.body.price,
        status: req.body.status
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
    var listing_num = req.params.listing_id;
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