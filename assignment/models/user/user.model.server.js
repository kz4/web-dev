module.exports = function () {

    var mongoose = require('mongoose');
    var UserSchema = require("./user.schema.server")();
    var User = mongoose.model("User", UserSchema);


    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser
    };
    return api;
    
    function deleteUser(userId) {
        return User.remove({_id: userId});
    }

    function updateUser(userId, user) {
        return User.update({_id: userId}, {

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
        return User.create(user);
    }

    function findUserById(userId) {
        return User.findById(userId);
    }

    function findUserByCredentials(username, password, res) {
        return User.findOne({username: username, password: password});
    }
};