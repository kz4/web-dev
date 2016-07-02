module.exports = function () {

    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: String,
        firstName: String,
        profilePic: String,
        google: {
            token: String,
            id: String,
            displayName: String
        },
        lastName: String,
        email: String,
        phone: String,
        dob: Date,
        following: [{type: mongoose.Schema.ObjectId, ref: "ProjectUser"}],
        followedBy: [{type: mongoose.Schema.ObjectId, ref: "ProjectUser"}],
        comments: [{type: mongoose.Schema.ObjectId, ref: "Comment"}],
        restaurants: [{type: mongoose.Schema.ObjectId, ref: "Restaurant"}],
        userType: {
            type: String,
            enum: ['NORMAL', 'ADMIN']
        },
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.user"});

    return UserSchema;
};