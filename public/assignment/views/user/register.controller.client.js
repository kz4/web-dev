(function () {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController)
    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.register = register;
        function register(username, password, verifyPassword) {
            UserService
                // .createUser(username, password, verifyPassword)
                .register(username, password, verifyPassword)
                .then(function (res) {
                    var user = res.data;
                        if (user._id) {
                            var id = user._id;
                            $rootScope.currentUser = user;
                            $location.url("/user/" + id);
                        } else {
                            // vm.error="Username empty, already exists or password not matches";
                            vm.error = user;
                        }
                });
        }
    }
})();