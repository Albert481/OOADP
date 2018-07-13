var user = require('../models/users');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

//Edit profile
exports.edit = function(req,res){
    var record_num = req.user.id;
    user.findById(record_num).then(function(userRecord){
        res.render('editprofile', {
            title: "Edit Profile",
            user: userRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

//Update profile
exports.update = function (req, res) {
    var record_num = req.user.id;
    var updateData = {
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio,
        address: req.body.address
    }
    user.update(updateData, { where: {id: record_num}}).then((updatedRecord)=>{
        if(!updatedRecord || updatedRecord == 0){
            return res.send(400,{
                message: "error"
            });
        }
        res.status(200).send({message: "Updated student record: " + record_num});
    })

}

//edit profile authorization
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}