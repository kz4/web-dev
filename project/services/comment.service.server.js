module.exports = function(app, models) {

    var commentModel = models.commentModel;

    app.post("/api/comment", createComment);
    app.put("/api/comment", updateComment);
    app.get("/api/comment", getAllComments);
    // post("/api/reply", createReply);

    function getAllComments(req, res) {
        commentModel
            .getAllComments()
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
        var comment = req.body;
        commentModel
            .updateComment(comment)
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