module.exports = function (app, models) {
    var commentModel = models.commentModel;
    var replyModel = models.replyModel;

    app.post("/api/comment/:commentId", createReply);
    app.put("/api/comment/:commentId/reply/:replyId", updateReply);
    app.delete("/api/reply/:replyId", deleteReplyByReplyId);
    app.get("/api/comment/:commentId/reply", getAllReplies);
    app.get("/api/comment/:commentId/reply", getAllReplies);
    app.get("/api/comment/:commentId/reply/:replyId", findReplyById);

    function findReplyById(req, res) {
        var replyId = req.params.replyId;
        replyModel
            .findReplyById(replyId)
            .then(
                function (reply) {
                    res.json(reply);
                },
                function (err) {
                    res.send(err);
                }
            )
    }

    function getAllReplies(req, res) {
        var commentId = req.params.commentId;
        replyModel
            .getAllRepliesForCommentId(commentId)
            .then(
                function (replies) {
                    res.json(replies);
                },
                function (error) {
                    res.send(error);
                }
            );
    }

    function deleteReplyByReplyId(req, res) {
        var replyId = req.params.replyId;
        replyModel
            .deleteReplyByReplyId(replyId)
            .then(
                function () {
                    res.send(200);
                },
                function (err) {
                    res.send(err);
                }
            )
    }

    function updateReply(req, res) {
        var commentId = req.params.commentId;
        var replyId = req.params.replyId;
        var reply = req.body;
        replyModel
            .updateReply(commentId, replyId, reply)
            .then(
                function () {
                    res.send(200);
                },
                function (error) {
                    res.send(error);
                }
            );
    }

    function createReply(req, res) {
        var commentId = req.params.commentId;
        var reply = req.body;
        if (reply.content) {
            replyModel
                .createReply(commentId, reply)
                .then(
                    function (newReply) {
                        // res.json(newReply);
                        commentModel
                            .populateReply(commentId, newReply)
                            .then(function () {
                                res.json(newReply);
                            },
                            function (error) {
                                res.send(error);
                            })
                    },
                    function (error) {
                        res.send(error);
                    }
                );
        }
    }
};