(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
    function LoginController($location) {
        var vm = this;
        // vm.login = function () {
        //     console.log($scope.model.user.username);
        // }
        vm.hello="Hello world!";
        vm.login = function (username, password) {
            console.log(username);
            console.log(password);
            $location.path() == '/profile'
        }
    }
})();