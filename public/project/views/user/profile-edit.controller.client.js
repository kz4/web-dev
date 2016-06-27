(function () {
    angular
        .module("ProjectMaker")
        .controller("ProfileEditController", ProfileEditController);

    function ProfileEditController($location, $rootScope, $routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        var currentUser = $rootScope.currentUser;
        vm.currentUser = currentUser;
        vm.isLoggedIn = isLoggedIn;
        vm.isCurrentUserSameAsProfile = isCurrentUserSameAsProfile;
        vm.hasProfilePicture = hasProfilePicture;

        var userId = $routeParams.uid;

        // var id = $routeParams['uid'];
        var id = $rootScope.currentUser._id;

        function init() {
            if (!userId) {
                if (isLoggedIn()) {
                    userId = $rootScope.currentUser._id;
                }
            }

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
                );
        }
        init();

        function isCurrentUserSameAsProfile() {
            var res = userId && vm.currentUser._id && (vm.currentUser._id === userId);
            return res;
        }


        function hasProfilePicture(pic) {
            return !(pic == null || pic == undefined);
        }

        function isLoggedIn() {
            var res = ($rootScope.currentUser !== undefined && $rootScope.currentUser !== null);
            return res;
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
                    function () {
                        // vm.inf = "Profile updated";
                        $location.url("/user/" + id);
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