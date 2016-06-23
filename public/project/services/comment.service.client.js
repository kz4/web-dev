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
            getAllComments : getAllComments
        };
        return api;
        
        function getAllComments() {
            return $http.get("/api/comment");
        }
        
        // function updateReply(put) {
        //     $http.put("/api/reply", reply);
        // }
        
        function updateComment(comment) {
            return $http.put("/api/comment", comment);
        }
        
        // function createReply(reply) {
        //     $http.post("/api/reply", reply);
        // }
        
        function createComment(comment) {
            return $http.post("/api/comment", comment);
        }
    }
})();