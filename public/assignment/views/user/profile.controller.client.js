(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);
    function ProfileController($routeParams, UserService) {
        var vm = this;
        var id = $routeParams['uid'];

        function init() {
            vm.user = UserService.findUserById(id);
        }
        init();

        vm.updateUser = updateUser;
        function updateUser(user) {
            var res = UserService.updateUser(id, user);
            if (res) {
                vm.inf = "Profile updated";
            } else {
                vm.error = "Profile failed to be updated";
            }
        }
    }
})();