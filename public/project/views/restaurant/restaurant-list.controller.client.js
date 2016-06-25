(function () {
    angular
        .module("ProjectMaker")
        .controller("RestaurantListController", RestaurantListController);

    function RestaurantListController($routeParams, RestaurantService, $location, $window, $rootScope) {
        var vm = this;

        var categoryId = $routeParams['categoryId'];
        var zip = $routeParams.zip;
        vm.categoryId = categoryId;
        vm.zip = zip;
        vm.selectRestaurant = selectRestaurant;
        vm.currentUser = $rootScope.currentUser;
        vm.logout = logout;

        function logout() {
            $rootScope.currentUser = null;
            UserService
                .logout()
                .then(
                    function (res) {
                        $location.url("/login");
                    },
                    function () {
                        $location.url("/login");
                    }
                );
        }

        function selectRestaurant(restaurant) {
            // $window.location.href = restaurant.url;
            $location.url("category/" + categoryId + "/zip/" + zip + "/restaurant/" + restaurant.id);
        }

        function init() {
            var locationInfo = {
                location: location,
                zip: zip
            };
            RestaurantService
                .findRestaurantServicesByCategoryId(categoryId, locationInfo)
                .then(function (res) {
                    var restaurants = res.data;
                    if (restaurants.businesses) {
                        vm.restaurants = restaurants.businesses;
                    }
                })
        }
        init();
    }

})();