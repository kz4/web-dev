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
        vm.getCategory = getCategory;
        vm.getCategoryArray = getCategoryArray;
        
        vm.categoryId = categoryId;

        function getCategory(restaurant) {
            var category = "";
            for (var i = 0; i < restaurant.categories.length; ++i) {
                category = category  + ", " + restaurant.categories[i][0];
            }
            return category;
        }

        function getCategoryArray(restaurants) {
            if (restaurants) {
                var categories = [];
                var category = "";
                for (var j = 0; j < restaurants.length; ++j){
                    category = "";
                    for (var i = 0; i < restaurants[j].categories.length; ++i) {
                        var oneCategory = restaurants[j].categories[i][0];
                        category = oneCategory  + ", " + category;
                    }
                    category = category.substring(0, category.length - 2);
                    categories.push(category);
                }
                return categories;
            }
        }

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
                        // var category =
                    }
                })
        }
        init();
    }

})();