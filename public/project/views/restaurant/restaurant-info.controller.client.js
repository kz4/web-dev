(function () {
    angular
        .module("ProjectMaker")
        .controller("RestaurantInfoController", RestaurantInfoController);
     
    function RestaurantInfoController($sce, $routeParams, RestaurantService) {
        var vm = this;

        var restaurantId = $routeParams['restaurantId'];
        vm.restaurantId = restaurantId;

        /*
         * Yelp provides two version, array[0] is uppercase, array[1] is lowercase
         */
        function selectUpperCase(array) {
            return array[0];
        }

        function getSafeUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }
        
       function init() {
           var keyUrl = "";
           RestaurantService
               .getGoogleMapKey()
               .then(function (res) {
                   var googleMapKey = res.data;
                   keyUrl = "&key=" + googleMapKey;
               })
               .then(
                   RestaurantService
                       .findRestaurantByYelpRestaurantId(restaurantId)
                       .then(function (res) {
                           var restaurant = res.data;
                           if (restaurant) {
                               vm.restaurant = restaurant;
                               var categories = restaurant.categories.map(selectUpperCase).join(", ")
                               vm.categories = categories;

                               var location = restaurant.location.display_address.join(", ");
                               vm.location = location;
                               var imageUrl = restaurant.image_url.substring(0, restaurant.image_url.lastIndexOf("ms"))
                                   + 'o.jpg';
                               vm.image = imageUrl;

                               var googleMapSrc = "https://www.google.com/maps/embed/v1/place?q="
                                   + restaurant.location.coordinate.latitude + ","
                                   + restaurant.location.coordinate.longitude
                                   + keyUrl;
                               vm.googleMapSrc = getSafeUrl(googleMapSrc);
                           }
                       })
               )

       }
       init();
    }

})();