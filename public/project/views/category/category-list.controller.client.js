(function () {
    angular
        .module("ProjectMaker")
        .controller("CategoryListController", CategoryListController);

    function CategoryListController(UserService, $location, $anchorScroll, $rootScope, $http, $q) {
        var vm = this;
        vm.setZipCode = setZipCode;
        vm.submitted = false;
        vm.invalid = false;

        vm.selectCategory = selectCategory;
        vm.onChanged = onChanged;
        vm.currentUser = $rootScope.currentUser;
        vm.logout = logout;

        function init() {
            window.navigator.geolocation.getCurrentPosition(function(pos){
                $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+pos.coords.latitude
                    +','+pos.coords.longitude+'&sensor=true').then(function(res){
                    if (res.data && res.data.results) {
                        var results = res.data.results;
                        var zip = extractFromAdress(results[0].address_components, "postal_code");
                        console.log(zip);
                        if (isValidUSZip(zip)) {
                            vm.zip = zip;
                        }
                    }
                });
            })
        }
        init();

        function extractFromAdress(components, type){
            for (var i=0; i<components.length; i++) {
                for (var j = 0; j < components[i].types.length; j++) {
                    if (components[i].types[j] == type) {
                        return components[i].long_name;
                    }
                }
            }
                return "";
        }

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