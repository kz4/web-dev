(function () {
    angular
        .module("ProjectMaker")
        .factory("CommentService", CommentService);

    function CommentService($http) {
        var api = {
            createComment : createComment,
            // createReply : createReply,
            updateComment : updateComment,
            // updateReply : updateReply
            getAllComments : getAllComments,
            findCommentByCommentId : findCommentByCommentId,
        };
        return api;

        function findCommentByCommentId(commentId) {
            return $http.get("/api/comment/" + commentId);
        }

        function getAllComments(restaurantId) {
            return $http.get("/api/comment/restaurant/" + restaurantId);
        }

        // function updateReply(put) {
        //     $http.put("/api/reply", reply);
        // }

        function updateComment(commentId, comment) {
            return $http.put("/api/comment/" + commentId, comment);
        }

        // function createReply(reply) {
        //     $http.post("/api/reply", reply);
        // }

        function createComment(comment) {
            return $http.post("/api/comment", comment);
        }
    }
})();