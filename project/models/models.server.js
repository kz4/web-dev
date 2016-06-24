module.exports = function () {
    
    var models = {
        userModel: require("./user/user.model.server")(),
        commentModel: require("./comment/comment.model.server")(),
        replyModel: require("./reply/reply.model.server")()
    };
    return models;
};