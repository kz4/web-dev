module.exports = function (app) {

    var models = require("./models/models.server.js")();

    require("./services/user.service.server.js")(app, models);
    require("./services/restaurant.service.server")(app, models);
    require("./services/comment.service.server")(app, models);
    // require("./services/website.service.server.js")(app, models);
    // require("./services/page.service.server.js")(app, models);
    // require("./services/widget.service.server.js")(app, models);
};