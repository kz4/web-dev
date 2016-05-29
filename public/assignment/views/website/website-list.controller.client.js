(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController);
     
    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;

        var userId = $routeParams['uid'];
        vm.userId = userId;

        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(userId);
        }
        init();
    }

})();