(function () {
    angular
        .module("WebAppMaker")
        .controller("EditWebsiteController", EditWebsiteController);

    function EditWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        var userId = $routeParams.uid;
        vm.userId = userId;
        
        var websiteId = $routeParams.wid;

        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite; 

        function init() {
            vm.website = WebsiteService.findWebsiteById(websiteId);
        }
        init();
        
        function updateWebsite(website) {
            var res = WebsiteService.updateWebsite(websiteId, website);
            if (res) {
                $location.url("user/" + userId + "/website")
            } else {
                vm.error = "Failed to update website, name empty or exists already";
            }
        }

        function deleteWebsite() {
            var res = WebsiteService.deleteWebsite(websiteId);
            if (res) {
                $location.url("user/" + userId + "/website")
            } else {
                vm.error = "Failed to delete website";
            }
        }
    }
})();