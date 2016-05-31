(function () {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController)
    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;
        function register(username, password, verifyPassword) {
            UserService
                .createUser(username, password, verifyPassword)
                .then(function (res) {
                    var user = res.data;
                        if (user) {
                            var id = user._id;
                            $location.url("/user/" + id + "/website");
                        } else {
                            vm.error="Username empty, already exists or password not matches";
                        }
                });
        }
    }
})();