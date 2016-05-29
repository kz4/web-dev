(function () {
    angular
        .module("WebAppMaker")
        .controller("NewWebsiteController", NewWebsiteController);

    function NewWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.createWebsite = createWebsite;

        var userId = $routeParams.uid;
        vm.userId = userId;

        function createWebsite(newWebsite) {
            var res = WebsiteService.createWebsite(userId, newWebsite);
            if (res) {
                $location.url("/user/" + userId + "/website");
            } else {
                vm.error = "Error creating a website, name empty or already exists";
            }
        }
    }
})();