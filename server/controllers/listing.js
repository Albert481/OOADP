//Import modules
var fs = require('fs');
var mime = require('mime');
//get gravatar icon from email
var gravatar = require('gravatar');
//set listing image file types
var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

//get listing models
var Listing = require('../models/listing');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

//Show listing gallery
exports.show = function (req, res) {
    sequelize.query('select l.id, l.title, l.created, l.imageName, l.description, l.price, u.email AS [user_id] from Listing l join Users u on l.user_id = u.id',
    {model : Listing}).then((listing) => {
        res.render('listing-gallery',{
            title: 'Listing Gallery',
            listing: listing,
           // description: description,
           // price: price,
            gravatar: gravatar.url(listing.user_id, {s: '80', r: 'x', d: 'retro'}, true),
            urlPath: req.protocol + "://" + req.get("host") + req.url
        })
    }).catch((err) =>{
        return res.status(400).send({
            message: err
        });
    });
};

/*
//Listing image upload
exports.uploadListing = function (req, res) {
    var src;
    var dest;
    var targetPath;
    var targetName;
    var tempPath = req.file.path;
    console.log(req.file);
    //get the mime type of the file
    var type = mime.lookup(req.file.mimetype);
    // get file extension
    var extension = req.file.pathsplit(/[. ]+/).pop();
    // check support file types
    if (IMAGE_TYPE.index.Of(type) == -1){
        return res.status(415).send('Supported image formats: jpeg, jpg, jpe, png.');
    }
    else if (price <= 0){
        return res.status(415).send('Price should be above $0.');
    }
    else if (description == null){
        return res.status(415).send('Description cannot be empty.');
    }

//Set new path to listing
targetPath = './public/listing' + req.file.orginalname;
// using read stream API to read file
src = fs.createReadStream(tempPath);
// using a write stream API to write file
dest = fs.createWriteStream(targetPath);
src.pipe(dest);
//Show error
src.on('error', function(err){
    if (err){
        return res.status(500).send({
            message: error
        });
    }
});

//Save file process
src.on('end', function() {
    //create a new instance of the Listing model with request body
    var listingData = {
        title: req.body.title,
        imageName: req.file.originalname,
        decription: req.params.decription,
        price: req.body.price,
        user_id: req.user.id
    }
    //Save to database
    Listing.create(listingData).then((newListing, created) => {
        if (!newListing){
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('listing-gallery');
    })

    //remove from temp folder
    fs.unlink(tempPath, function (err) {
        if (err){
            return res.status(500).send('Something happened, please try again later.');
        }
        //Redirect to gallery's page
        res.redirect('listing-gallery');
    });
});
};
*/
exports.create = function (req, res) {
    console.log("creating listing")

    var listingData = {
        title: req.body.title,
        created: req.body.created,
        imageName: req.file.originalname,
        description: req.params.description,
        price: req.body.price,
        user_id: req.user.id
    }

    Listing.create(listingData).then((newListing, created) => {
        if (!newListing) {
            return res.send(400, {
                message: "error"
            });
        }

        res.redirect('/listing');
    })
};
exports.delete = function (req, res) {
    var record_num = req.params.listing_id;
    console.log("deleting listing" + record_num);
    Listing.destroy({where: {id: record_num}}).then((deletedListing)=>{
        if(!deletedListing){
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted listing :" + record_num});
    })
}
// authorization middleware
exports.hasAuthorization = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}