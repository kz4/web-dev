module.exports = function () {
      
    var mongoose = require('mongoose');
    var ReplySchema = require("./reply.schema.server")();
    var Reply = mongoose.model("Reply", ReplySchema);
    
    var api = {
        createReply : createReply,
        updateReply : updateReply,
        getAllRepliesForCommentId : getAllRepliesForCommentId,
        findReplyById : findReplyById
    };
    return api;

    function findReplyById(replyId) {
        return Reply.findById(replyId);
    }
    
    function getAllRepliesForCommentId(commentId) {
        return Reply.find({commentId: commentId});
    }
    
    function updateReply(replyId, reply) {
        return Reply.update({_id: replyId}, {
           $set: {
               isThisReplyCommentAreaShown: reply.isThisReplyCommentAreaShown,
               isThisReplyReplyAreaShown: reply.isThisReplyReplyAreaShown
           } 
        });
    }
    
    function createReply(commentId, reply) {
        reply.commentId = commentId;
        return Reply.create(reply);
    }
};