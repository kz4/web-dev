(function () {
    angular
        .module("ProjectMaker")
        .controller("RestaurantListController", RestaurantListController);
     
    function RestaurantListController($routeParams, RestaurantService, $location, $window) {
        var vm = this;

        var categoryId = $routeParams['categoryId'];
        var zip = $routeParams.zip;
        vm.categoryId = categoryId;
        vm.zip = zip;
        vm.selectRestaurant = selectRestaurant;

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