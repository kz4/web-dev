module.exports = function (app) {

    var models = require("./models/models.server.js")();

    require("./services/user.service.server.js")(app, models);
    require("./services/restaurant.service.server")(app, models);
    require("./services/comment.service.server")(app, models);
    require("./services/reply.service.server")(app, models);
};