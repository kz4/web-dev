(function () {
    angular
        .module("ProjectMaker")
        .controller("AdminInfoController", AdminInfoController);
    
    function AdminInfoController($location, $rootScope, UserService, $routeParams, $scope) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        var currentUser = $rootScope.currentUser;
        vm.currentUser = currentUser;
        vm.hasProfilePicture = hasProfilePicture;
        vm.isLoggedIn = isLoggedIn;
        vm.isCurrentUserSameAsProfile = isCurrentUserSameAsProfile;

        vm.editUser = editUser;


        var userId = $routeParams.uid;

        function editUser(user) {
            var id = user._id;
            $location.url("/user/" + id);
        }

        function isCurrentUserSameAsProfile() {
            var res = userId && vm.currentUser._id && (vm.currentUser._id === userId);
            return res;
        }

        function isLoggedIn() {
            var res = ($rootScope.currentUser !== undefined && $rootScope.currentUser !== null);
            return res;
        }

        function hasProfilePicture(pic) {
            return !(pic == null || pic == undefined);
        }

        function init() {
            UserService
                .findAllUsers()
                .then(
                    function (res) {
                        var users = res.data;
                        var usersExceptSelf = [];
                        for (var i = 0; i < users.length; i++) {
                            if (users[i]._id === currentUser._id) {
                                continue;
                            } else {
                                usersExceptSelf.push(users[i]);
                            }
                        }
                        vm.users = usersExceptSelf;
                    },
                    function (err) {
                        vm.error = err;
                    }
                );
        }
        init();

        function logout() {
            $rootScope.currentUser = null;
            UserService
                .logout()
                .then(
                    function () {
                        $location.url("/login");
                    },
                    function () {
                        $location.url("/login");
                    }
                );
        }

        function updateUser(id, user) {
            UserService
                .updateUser(id, user)
                .then(
                    function () {
                        vm.inf = "Profile updated";
                    },
                    function () {
                        vm.error = "Profile failed to be updated";
                    }
                );
        }

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .then(
                    function () {
                        $location.url("admin");
                    },
                    function (res) {
                        var err = res.data;
                        vm.error = err;
                    }
                )
        }
    }
})();