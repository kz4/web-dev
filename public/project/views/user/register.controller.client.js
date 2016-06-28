(function () {
    angular
        .module("ProjectMaker")
        .controller("RegisterController", RegisterController)
    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.register = register;
        vm.submitted = false;
        vm.badPassword = false;
        vm.isAdmin = false;
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

        function register(username, password, verifyPassword) {
            vm.submitted = true;
            if (password === verifyPassword) {
                UserService
                // .createUser(username, password, verifyPassword)
                    .register(username, password, verifyPassword, vm.isAdmin)
                    .then(function (res) {
                        var user = res.data;
                        if (user._id) {
                            var id = user._id;
                            $rootScope.currentUser = user;
                            $location.url("/user/" + id);
                            vm.submitted = false;
                            vm.badPassword = false;
                        } else {
                            // vm.error="Username empty, already exists or password not matches";
                            vm.error = user;
                        }
                    });
            } else {
                vm.error = "Password do not match";
                vm.badPassword = true;
            }
        }
    }
})();