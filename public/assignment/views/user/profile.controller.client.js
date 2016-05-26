(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController)
    function ProfileController($routeParams) {
        var vm = this;
        // var vm.userId = $routeParams["userId"];
        // function init() {
        //     vm.user = UserService.findUserById(vm.userId);
        // }
        // init();
    }
})();