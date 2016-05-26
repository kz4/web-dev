(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        // .controller("RegisterController", RegisterController)
        // .controller("ProfileController", ProfileController)
    // function LoginController($scope) {
    //     $scope.hello = "hello from controller";
    //     $scope.login = function () {
    //         console.log($scope.model.user.username);
    //     }
    //     var vm = this;
    // }
    function LoginController() {
        var vm = this;
        vm.login = function () {
            console.log($scope.model.user.username);
        }
    }
    function RegisterController() {
        var vm = this;
    }
    // function ProfileController() {
    //     var vm = this;
    //     var vm.userId = $routeParams["userId"];
    //     function init() {
    //         vm.user = UserService.findUserById(vm.userId);
    //     }
    //     init();
    // }
})();