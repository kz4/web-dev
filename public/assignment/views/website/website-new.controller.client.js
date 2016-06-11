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
            WebsiteService
                .createWebsite(userId, newWebsite)
                .then(function (res) {
                    var website = res.data;
                    if (website.name) {
                        $location.url("/user/" + userId + "/website");
                    } else {
                        // in this case website is an error message
                        vm.error = website;
                    }
                });
        }
    }
})();