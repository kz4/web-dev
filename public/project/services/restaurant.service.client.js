(function() {
    angular
        .module("ProjectMaker")
        .factory("RestaurantService", RestaurantService);

    function RestaurantService($http) {
        var api = {
            findRestaurantServicesByCategoryId : findRestaurantServicesByCategoryId
        };
        return api;

        function findRestaurantServicesByCategoryId(id, locationInfo) {
            var url = "/api/restaurant/" + id;
            return $http.post(url, locationInfo);
        }
    }
})();


