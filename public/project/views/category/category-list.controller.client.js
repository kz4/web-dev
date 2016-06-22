(function () {
    angular
        .module("ProjectMaker")
        .controller("CategoryListController", CategoryListController);

    function CategoryListController($location, $routeParams) {
        var vm = this;
        vm.setZipCode = setZipCode;
        vm.submitted = false;

        function setZipCode(zip) {
            // vm.zip = zip;
            vm.submitted = true;
            var zipCode = parseInt(zip);
            if (isValidUSZip(zipCode)) {


            } else {

                vm.submitted = true;
            }
        }

        function isValidUSZip(sZip) {
            return /^\d{5}(-\d{4})?$/.test(sZip);
        }
    }
})();