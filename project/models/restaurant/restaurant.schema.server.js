module.exports = function () {
    var mongoose = require('mongoose');

    var RestaurantSchema = mongoose.Schema({
        restaurantId: String,
        categoryId: String,
        zip: String,
        users: [{type: mongoose.Schema.ObjectId, ref: "ProjectUser"}]
    }, {collection: "project.restaurant"});

    return RestaurantSchema;
};