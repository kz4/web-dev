(function () {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController);
    
    function PageListController($routeParams, PageService) {
        var vm = this;
        var userId = $routeParams.uid;
        vm.userId = userId;
        var websiteId = $routeParams.wid;
        vm.websiteId = websiteId;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(websiteId);
        }
        init();
    }
})();