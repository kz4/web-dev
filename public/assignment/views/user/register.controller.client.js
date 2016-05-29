(function () {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController)
    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;
        function register(username, password, verifyPassword) {
            var user = UserService.createUser(username, password, verifyPassword);
            if (user) {
                var id = user._id;
                $location.url("/user/" + id + "/website");
            } else {
                vm.error="Username empty, already exists or password not matches";
            }
        }
    }
})();