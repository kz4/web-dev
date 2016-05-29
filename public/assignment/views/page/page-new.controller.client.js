(function () {
    angular
        .module("WebAppMaker")
        .controller("NewPageController", NewPageController);
    
    function NewPageController($location, $routeParams, PageService) {
        var vm = this;
        var userId = $routeParams.uid;
        vm.userId = userId;
        var websiteId = $routeParams.wid;
        vm.websiteId = websiteId;
        
        vm.createPage = createPage;

        function createPage(page) {
            var res = PageService.createPage(websiteId, page);
            if (res) {
                $location.url("user/" + userId + "/website/" + websiteId + "/page");
            } else {
                vm.error = "Failed to create a page, name already exists or empty";
            }
        }
    }
})();