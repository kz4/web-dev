module.exports = function () {

    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: String,
        firstName: String,
        google: {
            token: String,
            id: String,
            displayName: String
        },
        lastName: String,
        email: String,
        phone: String,
        dob: Date,
        // websites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Website'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.user"});

    return UserSchema;
};