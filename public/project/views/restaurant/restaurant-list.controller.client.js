(function () {
    angular
        .module("ProjectMaker")
        .controller("RestaurantListController", RestaurantListController);
     
    function RestaurantListController($routeParams) {
        var vm = this;

        var categoryId = $routeParams['categoryId'];
        vm.categoryId = categoryId;

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