(function () {
    angular
        .module("ProjectMaker")
        .controller("ProfileInfoController", ProfileInfoController);
    
    function ProfileInfoController($location, $rootScope, UserService, $routeParams) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        var currentUser = $rootScope.currentUser;
        vm.currentUser = currentUser;
        vm.hasProfilePicture = hasProfilePicture;
        vm.isLoggedIn = isLoggedIn;
        vm.follow = follow;
        var userId = $routeParams.uid;

        function isLoggedIn() {
            return ($rootScope.currentUser !== undefined && $rootScope.currentUser !== null);
        }
y
        // var id = $rootScope.currentUser._id;
        function hasProfilePicture(pic) {
            return !(pic == null || pic == undefined);
        }

        function init() {
            UserService
                .findUserById(userId)
                .then(
                    function (res) {
                        vm.user = res.data;
                        vm.profilePic = vm.user.profilePic;
                    },
                    function (err) {
                        vm.error = err;
                    }
                )
        }
        init();

        function follow() {
            
        }

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
                    },
                    function (res) {
                        var err = res.data;
                        vm.error = err;
                    }
                )
        }
    }
})();