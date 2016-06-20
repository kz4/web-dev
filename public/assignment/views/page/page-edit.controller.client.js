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
        vm.submitted = false;

        function init() {
            PageService
                .findPageById(pageId)
                .then(function (res) {
                    vm.page = res.data;
                });
        }
        init();

        function updatePage(page) {
            vm.submitted = true;
            PageService
                .updatePage(pageId, page)
                .then(function (res) {
                    var result = res.data;
                    if (result.name) {
                        $location.url("user/" + userId + "/website/" + websiteId + "/page/");
                    } else {
                        vm.error = "Failed to update the page";
                    }
                });
        }

        function deletePage() {
            PageService
                .deletePage(pageId)
                .then(function (res) {
                    var result = res.data;
                    if (result) {
                        $location.url("user/" + userId + "/website/" + websiteId + "/page");
                    } else {
                        vm.error = "Failed to delete the page";
                    }
                });
        }
    }
})();