(function () {
    angular
        .module("WebAppMaker")
        .controller("EditPageController", EditPageController);

    function EditPageController($location, $routeParams, PageService) {
        var vm = this;
        var userId = $routeParams.uid;
        vm.userId = userId;
        var websiteId = $routeParams.wid;
        vm.websiteId = websiteId;
        var pageId = $routeParams.pid;
        vm.pageId = pageId;

        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            vm.page = PageService.findPageById(pageId);
        }
        init();

        function updatePage(page) {
            var res = PageService.updatePage(pageId, page);
            if (res) {
                $location.url("user/" + userId + "/website/" + websiteId + "/page/");
            } else {
                vm.error = "Failed to update the page";
            }
        }

        function deletePage() {
            var res = PageService.deletePage(pageId);
            if (res) {
                $location.url("user/" + userId + "/website/" + websiteId + "/page");
            } else {
                vm.error = "Failed to delete the page";
            }
        }
    }
})();