module.exports = function () {
    var mongoose = require("mongoose");

    var ReplySchema = mongoose.Schema({
        commentId: String,
        replierId: String,
        replier: String,
        hostId: String,
        host: String,
        date: {type: Date, default: Date.now},
        content: String,
        isThisReplyCommentAreaShown: Boolean,
        isThisReplyReplyAreaShown: Boolean
    }, {collection: "project.reply"});

    return ReplySchema;
};