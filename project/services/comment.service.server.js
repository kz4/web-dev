module.exports = function(app, models) {

    var commentModel = models.commentModel;

    app.post("/api/comment", createComment);
    app.put("/api/comment/:commentId", updateComment);
    app.get("/api/comment/restaurant/:restaurantId", getAllComments);
    app.get("/api/comment/:commentId", findCommentByCommentId);
    app.delete("/api/comment/:commentId", deleteCommentByCommentId);

    // post("/api/reply", createReply);

    function deleteCommentByCommentId(req, res) {
        var commentId = req.params.commentId;
        
        commentModel
            .deleteCommentByCommentId(commentId)
            .then(
                function () {
                    res.send(200);
                },
                function (err) {
                    res.send(err);
                }
            )
    }

    function findCommentByCommentId(req, res) {
        var commentId = req.params.commentId;
        commentModel
            .findCommentByCommentId(commentId)
            .then(
                function (comment) {
                     res.json(comment);
                },
                function (err) {
                    res.send(err);
                }
            )
    }

    function getAllComments(req, res) {
        var restaurantId = req.params.restaurantId;
        commentModel
            .getAllComments(restaurantId)
            .then(
                function (comments) {
                    res.json(comments);
                },
                function (err) {
                    res.send(err);
                }
            );
    }
    
    // function createReply(req, res) {
    //     var reply = req.body;
    //     if (reply.content) {
    //         commentModel
    //             .createReply()
    //     }
    // }

    function updateComment(req, res) {
        var commentId = req.params.commentId;
        var comment = req.body;
        commentModel
            .updateComment(commentId, comment)
            .then(
                function () {
                    res.send(200);
                },
                function (error) {
                    res.send(error);
                }
            );
    }
    
    function createComment(req, res) {
        var comment = req.body;
        if (comment.content) {
            commentModel
                .createComment(comment)
                .then(
                    function (newComment) {
                        res.json(newComment);
                    },
                    function (error) {
                        res.send(error);
                    });
        }
    }
};