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
        vm.isCurrentUserSameAsProfileOrAdmin = isCurrentUserSameAsProfileOrAdmin;
        vm.hasProfilePicture = hasProfilePicture;
        vm.deleteProfilePic = deleteProfilePic;

        var userId = $routeParams.uid;
        vm.userId = userId;
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
        
        function deleteProfilePic() {
            if (vm.profilePic.startsWith("/uploads/")) {
                var parts = vm.user.profilePic.split("/");
                var pathWithoutUploads = parts[parts.length - 1];   // We only want the filename of the picture
                UserService
                    .deleteUserProfilePic(userId, pathWithoutUploads)
                    .then(
                        function (res) {
                            var result = res.data;
                            if (result === "OK") {
                                vm.user.profilePic = null;
                                var user = vm.user;
                                updateUser(user);
                            } else {
                                vm.error = "Failed to delete the profile picture";
                            }
                        },
                        function (err) {
                            vm.error = err;
                        }
                    );
            } else {
                vm.user.profilePic = null;
                var user = vm.user;
                updateUser(user);
            }
            $location.url("/user/" + id);
        }

        function isCurrentUserSameAsProfileOrAdmin() {
            var isCurrentUserSameAsProfile = userId && vm.currentUser._id && (vm.currentUser._id === userId);
            var isAdmin = vm.currentUser.userType === "ADMIN";
            return isCurrentUserSameAsProfile || isAdmin;
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
                .updateUser(userId, user)
                .then(
                    function () {
                        // vm.inf = "Profile updated";
                        $location.url("/user/" + userId);
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