(function() {
    angular
        .module("ProjectMaker")
        .factory("RestaurantService", RestaurantService);

    function RestaurantService($http) {
        var api = {
            findRestaurantServicesByCategoryId : findRestaurantServicesByCategoryId,
            findRestaurantByYelpRestaurantId : findRestaurantByYelpRestaurantId,
            getGoogleMapKey : getGoogleMapKey,
            findRestaurantByYelpRestaurantIdInDB : findRestaurantByYelpRestaurantIdInDB,
            findAllUsersThatFavoredThisRestaurant : findAllUsersThatFavoredThisRestaurant,
            addRestaurantToFavorite : addRestaurantToFavorite,
            removeRestaurantFromFavorite : removeRestaurantFromFavorite,
            createRestaurantToFavorite : createRestaurantToFavorite
        };
        return api;

        function createRestaurantToFavorite(restaurantObject, userId) {
            return $http.post("/api/user/" + userId + "/restaurantcreate/" + restaurantObject.restaurantId, restaurantObject);
        }

        function findRestaurantByYelpRestaurantIdInDB(restaurantId) {
            var url = "/api/restaurantidindb/" + restaurantId;
            return $http.get(url);
        }

        function removeRestaurantFromFavorite(restaurantId, userId) {
            return $http.put("/api/user/" + userId + "/restaurantYelpId/" + restaurantId);
        }

        function addRestaurantToFavorite(restaurantId, userId) {
            return $http.post("/api/user/" + userId + "/restaurantYelpId/" + restaurantId);
        }

        function findRestaurantByYelpRestaurantId(restaurantId) {
            var url = "/api/restaurant/" + restaurantId;
            return $http.get(url);
        }

        function getGoogleMapKey() {
            var url = "/api/googleMapKey";
            return $http.get(url);
        }

        function findAllUsersThatFavoredThisRestaurant(restaurantId) {
            var url = "/api/alluserfavorthisrestaurant/" + restaurantId;
            return $http.get(url);
        }
        
        function findRestaurantServicesByCategoryId(id, locationInfo) {
            var url = "/api/restaurant/" + id;
            return $http.post(url, locationInfo);
        }
    }
})();


