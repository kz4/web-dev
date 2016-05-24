(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
    function LoginController() {
        var vm = this;
    }
    function RegisterController() {
        var vm = this;
    }
    function ProfileController() {
        var vm = this;
        var vm.userId = $routeParams["userId"];
        function init() {
            vm.user = UserService.findUserById(vm.userId);
        }
        init();
    }
})();