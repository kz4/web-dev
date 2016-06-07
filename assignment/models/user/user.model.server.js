module.exports = function () {

    var mongoose = require('mongoose');
    var UserSchema = require("./user.schema.server");
    var User = mongoose.model("User", UserSchema);


    var api = {
        createUser: createUser,
        findUserById: findUserById
    };
    return api;
    
    function createUser(user) {
        return User.create(user);
    }

    function findUserById(userId) {
        return User.find(userId);
    }
};