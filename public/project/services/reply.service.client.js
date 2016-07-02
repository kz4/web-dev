(function () {
    angular
        .module("ProjectMaker")
        .factory("ReplyService", ReplyService);

    function ReplyService($http) {
        var api = {
            createReply: createReply,
            updateReply: updateReply,
            deleteReplyByReplyId : deleteReplyByReplyId,
            getAllRepliesForCommentId: getAllRepliesForCommentId,
            getReplyByReplyId: getReplyByReplyId
        };
        return api;

        function getReplyByReplyId(replyId) {
            return $http.get("/api/comment/0/reply/" + replyId);
        }
        
        function getAllRepliesForCommentId(commentId) {
            return $http.get("/api/comment/" + commentId + "/reply");
        }

        function deleteReplyByReplyId(replyId) {
            var url = "/api/reply/" + replyId;
            return $http.delete(url);
        }

        function updateReply(commentId, replyId, reply) {
            return $http.put("/api/comment/" + commentId + "/reply/" + replyId, reply);
        }

        function createReply(commentId, reply) {
            return $http.post("/api/comment/" + commentId, reply);
        }
    }
})();