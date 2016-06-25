(function () {
    angular
        .module("ProjectMaker")
        .controller("CategoryListController", CategoryListController);

    function CategoryListController(UserService, $location, $anchorScroll, $rootScope) {
        var vm = this;
        vm.setZipCode = setZipCode;
        vm.submitted = false;
        vm.invalid = false;

        vm.selectCategory = selectCategory;
        vm.onChanged = onChanged;
        vm.currentUser = $rootScope.currentUser;
        vm.logout = logout;

        function logout() {
            $rootScope.currentUser = null;
            UserService
                .logout()
                .then(
                    function (res) {
                        $location.url("/login");
                    },
                    function () {
                        $location.url("/login");
                    }
                );
        }

        function onChanged() {
            vm.submitted = false;
        }

        function selectCategory(categoryId, zip) {
            vm.submitted = true;
            if (isValidUSZip(zip)) {
                vm.submitted = false;
                $location.url("/category/" + categoryId + "/zip/" + zip + "/restaurant")
            } else {
                vm.invalid = true;
                $anchorScroll("head");
            }
        }

        function setZipCode(zip) {
            vm.submitted = true;
            var zipCode = zip;
            if (isValidUSZip(zipCode)) {
                vm.submitted = false;
                $anchorScroll("da-thumbs");
            } else {
                vm.invalid = true;
                $anchorScroll("head");
            }
        }

        function isValidUSZip(sZip) {
            return /^\d{5}(-\d{4})?$/.test(sZip);
        }
    }
})();