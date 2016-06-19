module.exports = function () {

    var mongoose = require('mongoose');
    var UserSchema = require("./user.schema.server")();
    var ProjectUser = mongoose.model("ProjectUser", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        populateWebsite: populateWebsite,
        spliceWebsite: spliceWebsite,
        findUserByGoogleId: findUserByGoogleId
    };
    return api;

    function findUserByGoogleId(id) {
        return ProjectUser.findOne({"google.id": id});
    }

    function spliceWebsite(userId, websiteId) {
        return ProjectUser.findOne({_id: userId},
            function(err, doc) {
                doc.websites.pull(websiteId);
                doc.save();
            });
    }

    function populateWebsite(userId, website) {
        return ProjectUser.findOne({_id: userId},
            function(err, doc) {
                doc.websites.push(website);
                doc.save();
            });
    }

    function deleteUser(userId) {
        return ProjectUser.remove({_id: userId});
    }

    function updateUser(userId, user) {
        return ProjectUser.update({_id: userId}, {

            // delete user._id;     // add this line, for older version of mongodb that set the _id,
            // if you just want to do $set: user
            //    $set: user    // you can use this, but username can also be used

            // do it this way, so you can customize the field you want to update
            $set: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    }

    function createUser(user) {
        return ProjectUser.create(user);
    }

    function findUserByUsername(username) {
        return ProjectUser.findOne({username: username});
    }

    function findUserById(userId) {
        return ProjectUser.findById(userId);
    }

    function findUserByCredentials(username, password) {
        return ProjectUser.findOne({username: username, password: password});
    }
};