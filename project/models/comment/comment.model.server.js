module.exports = function () {

    var mongoose = require('mongoose');
    var CommentSchema = require("./comment.schema.server")();
    var Comment = mongoose.model("Comment", CommentSchema);

    var api = {
        createComment : createComment,
        updateComment : updateComment,
        getAllComments : getAllComments
        // populateReply : populateReply
    };
    return api;

    function getAllComments() {
        return Comment.find();
    }

    // function populateReply() {
    //    
    // }
    
    function updateComment(commentId, comment) {
        return Comment.update({_id: commentId}, {
           $set: {
               isThisReplyCommentAreaShown: comment.isThisReplyCommentAreaShown
           } 
        });
    }
    
    function createComment(comment) {
        return Comment.create(comment);
    }
};