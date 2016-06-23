module.exports = function () {
    var mongoose = require('mongoose');

    var CommentSchema = mongoose.Schema({
        date: {type: Date, default: Date.now},
        categoryId: String,
        zip: String,
        restaurantId: String,
        // "commentIndex": commentIndex,
        commenterId: String,
        commenter: String,
        content: String,
        isThisReplyCommentAreaShown: Boolean,
        replies: [{type: mongoose.Schema.ObjectId, ref: "Comment"}]
    }, {collection: "project.comment"});

    return CommentSchema;
};