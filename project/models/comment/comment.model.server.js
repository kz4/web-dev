module.exports = function () {

    var mongoose = require('mongoose');
    var CommentSchema = require("./comment.schema.server")();
    var Comment = mongoose.model("Comment", CommentSchema);

    var api = {
        createComment : createComment,
        updateComment : updateComment,
        getAllComments : getAllComments,
        findCommentByCommentId : findCommentByCommentId,
        // populateReply : populateReply
        populateReply : populateReply
    };
    return api;

    function populateReply(commentId, reply) {
        return Comment.findOne({_id: commentId},
            function (err, doc) {
                doc.replies.push(reply);
                doc.save();
            }
        );
    }

    function findCommentByCommentId(commentId) {
        return Comment.findById(commentId);
    }

    function getAllComments(restaurantId) {
        return Comment.find({restaurantId: restaurantId});
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