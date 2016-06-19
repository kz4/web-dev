(function () {
    angular
        .module("ProjectMaker")
        .controller("RestaurantInfoController", RestaurantInfoController);
     
    function RestaurantInfoController($routeParams) {
        var vm = this;

        var restaurantId = $routeParams['restaurantId'];
        vm.restaurantId = restaurantId;

    //    function init() {
    //        vm.websites = WebsiteService
    //            .findWebsitesByUser(userId)
    //            .then(function (res) {
    //                var websites = res.data;
    //                if (websites) {
    //                    vm.websites = websites;
    //                }
    //            })
    //    }
    //    init();
    }

})();