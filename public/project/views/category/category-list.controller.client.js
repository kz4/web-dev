(function () {
    angular
        .module("ProjectMaker")
        .controller("CategoryListController", CategoryListController);

    function CategoryListController($location, $routeParams) {
        var vm = this;
        vm.setZipCode = setZipCode;
            
        function setZipCode(zip) {
            // vm.zip = zip;
        }
    }
})();