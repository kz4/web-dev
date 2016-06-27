module.exports = function () {
    
    var models = {
        userModel: require("./user/user.model.server")(),
        commentModel: require("./comment/comment.model.server")(),
        replyModel: require("./reply/reply.model.server")(),
        restaurantModel: require("./restaurant/restaurant.model.server")()
    };
    return models;
};