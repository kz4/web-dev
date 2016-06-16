(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            UserService
                // .findUserByCredentials(username, password)  // promise
                .login(username, password)  // promise
                .then(function (res) {
                    var user = res.data;
                    if (user && user._id) {
                        var id = user._id;
                        $location.url("/user/" + id);
                    } else {
                        vm.error = "User not found";
                    }
            });
        }
    }
})();