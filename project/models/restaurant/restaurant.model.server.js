module.exports = function () {

    var mongoose = require('mongoose');
    var RestaurantSchema = require("./restaurant.schema.server")();
    var Restaurant = mongoose.model("Restaurant", RestaurantSchema);

    var api = {
        findAllUsersThatFavoredThisRestaurant : findAllUsersThatFavoredThisRestaurant,
        addUserIdToRestaurantUsers : addUserIdToRestaurantUsers,
        createRestaurantToFavorite : createRestaurantToFavorite,
        removeUserIdFromRestaurantUsers : removeUserIdFromRestaurantUsers,
        findRestaurantByYelpRestaurantIdInDB : findRestaurantByYelpRestaurantIdInDB
    };
    return api;

    function findRestaurantByYelpRestaurantIdInDB(restaurantId) {
        return Restaurant.findOne({restaurantId: restaurantId});
    }

    function addUserIdToRestaurantUsers(restaurantId, userId) {
        return Restaurant.findOne({restaurantId: restaurantId},
            function (err, doc) {
                doc.users.push(userId);
                doc.save();
            }
        );
    }

    function createRestaurantToFavorite(restaurantObject, userId) {
        var restaurant = {
            users: [userId],
            restaurantId: restaurantObject.restaurantId,
            zip: restaurantObject.zip,
            restaurantPic: restaurantObject.restaurantPic,
            categoryId: restaurantObject.categoryId
        };
        return Restaurant.create(restaurant);
    }

    function removeUserIdFromRestaurantUsers(restaurantId, userId) {
        return Restaurant.findOne({restaurantId: restaurantId},
            function (err, doc) {
                doc.users.pull(userId);
                doc.save();
            });
    }

    function findAllUsersThatFavoredThisRestaurant(restaurantId) {
        return Restaurant.findOne({restaurantId: restaurantId})
            .populate('users')
            .exec(function(error, doc) {
                // doc.connections[0].item is a User doc
                // doc.connections[1].item is an Organization doc
            });
    }
};