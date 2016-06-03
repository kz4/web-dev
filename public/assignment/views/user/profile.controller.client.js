(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);
    function ProfileController($location, $routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        var id = $routeParams['uid'];

        function init() {
            UserService
                .findUserById(id)   // promise
                .then(function (res) {
                    vm.user = res.data;
            });
        }
        init();

        function updateUser(user) {
            UserService
                .updateUser(id, user)
                .then(
                    function (inf) {
                        vm.inf = "Profile updated";
                    },
                    function (error) {
                        vm.error = "Profile failed to be updated";
                    }
                );
        }

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .then(
                    function (res) {
                        $location.url("/");
                    }
                )
        }
    }
})();