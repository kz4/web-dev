module.exports = function () {

    var mongoose = require('mongoose');
    var CommentSchema = require("./comment.schema.server")();
    var Comment = mongoose.model("Comment", CommentSchema);

    var api = {
        createComment : createComment,
        updateComment : updateComment,
        getAllComments : getAllComments,
        findCommentByCommentId : findCommentByCommentId,
        deleteCommentByCommentId : deleteCommentByCommentId,
        populateReply : populateReply,
        deleteReplyFromRepliesArray : deleteReplyFromRepliesArray
    };
    return api;

    function deleteReplyFromRepliesArray(commentId, replyId) {
        return Comment.update(
            {_id: commentId},
            { $pull: {'replies': replyId}
        });
    }

    function populateReply(commentId, reply) {
        return Comment.findOne({_id: commentId},
            function (err, doc) {
                doc.replies.push(reply);
                doc.save();
            }
        );
    }

    function deleteCommentByCommentId(commentId){
        return Comment.remove({_id: commentId});
    }

    function findCommentByCommentId(commentId) {
        return Comment.findById(commentId);
    }

    function getAllComments(restaurantId) {
        return Comment.find({restaurantId: restaurantId})
            .populate('replies')
            .exec(function(error, doc) {
            // doc.connections[0].item is a User doc
            // doc.connections[1].item is an Organization doc
        });

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