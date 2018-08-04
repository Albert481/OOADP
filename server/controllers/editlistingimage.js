var ListingModel = require('../models/ListingModel');
var myDatabase = require('./database');
var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');
var Users = require('../models/users');
//set image file types
var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
var Images = require('../models/ListingModel');
var sequelize = myDatabase.sequelize;

//Edit one listing
exports.editImage = function(req,res){
    var listing_num = req.params.id;
    ListingModel.findById(listing_num).then(function (listingRecord) {
        res.render('editImage', {
            title: "Edit Image",
            item: listingRecord,
            notifi_id: -1,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: "error"
        });
    });
};

exports.updateImage = function (req, res) {
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
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.status(415).send('Supported image format: jpeg, jpg, jpe, png.');
    }
    //Set new path to images
    targetPath = './public/images/listingimages/' + req.file.originalname;
    //using read stream API to read file
    src = fs.createReadStream(tempPath);
    //using a write stream API to write file
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);

    // // Show error
    src.on('error', function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({
                message: "error"
            });
        }
    });

    // //Save file process
    src.on('end', function () {
        var listing_num = req.params.id;
        //create a new instance of the model with request body
        var updateImage = {
            imagename: req.file.originalname
        }
        ListingModel.update(updateImage, { where: { id: listing_num } }).then((updateRecord) => {
            if (!updateRecord || updateRecord == 0) {

                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect("/profile");
        })
        //remove from temp folder
        fs.unlink(tempPath, function (err) {
            if (err) {
                console.log(err)
                return res.status(500).send('Error');
            }
        });
    });
};