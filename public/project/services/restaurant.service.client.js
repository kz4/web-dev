(function() {
    angular
        .module("ProjectMaker")
        .factory("RestaurantService", RestaurantService);

    function RestaurantService($http) {
        var api = {
            findRestaurantServicesByCategoryId : findRestaurantServicesByCategoryId,
            findRestaurantByYelpRestaurantId : findRestaurantByYelpRestaurantId,
            getGoogleMapKey : getGoogleMapKey 
        };
        return api;
        
        function getGoogleMapKey() {
            var url = "/api/googleMapKey";
            return $http.get(url);
        }

        function findRestaurantByYelpRestaurantId(restaurantId) {
            var url = "/api/restaurant/" + restaurantId;
            return $http.get(url); 
        }
        
        function findRestaurantServicesByCategoryId(id, locationInfo) {
            var url = "/api/restaurant/" + id;
            return $http.post(url, locationInfo);
        }
    }
})();


