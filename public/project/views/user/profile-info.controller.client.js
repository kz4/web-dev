(function () {
    angular
        .module("ProjectMaker")
        .controller("ProfileInfoController", ProfileInfoController);
    
    function ProfileInfoController($location, $rootScope, UserService, $routeParams, $scope) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        var currentUser = $rootScope.currentUser;
        vm.currentUser = currentUser;
        vm.hasProfilePicture = hasProfilePicture;
        vm.isLoggedIn = isLoggedIn;
        vm.follow = follow;
        vm.isCurrentUserSameAsProfile = isCurrentUserSameAsProfile;

        vm.cannotFollow = cannotFollow;
        vm.canUnfollow = canUnfollow;
        vm.followUser = followUser;
        vm.unfollowUser = unfollowUser;

        var userId = $routeParams.uid;
        vm.userId = userId;

        vm.isAdmin = isAdmin;

        function isAdmin() {
            return (isLoggedIn() && $rootScope.currentUser.userType === "ADMIN");
        }

        function cannotFollow() {
            var res= (!isLoggedIn() // not loggedIn
            || isCurrentUserSameAsProfile() // OR is the user self
            || isLoggedUserFollowingProfileUser()); // OR has followed this user
            return res;
        }

        function canUnfollow() {
            var res = (isLoggedIn() // loggedIn
            && isLoggedUserFollowingProfileUser()); // AND has followed this user
            return res;
        }

        function isLoggedUserFollowingProfileUser() {
            for (var i = 0; i < $rootScope.currentUser.following.length; i++) {
                // must use $rootScope.currentUser instead of currentUser because currentUser just got updated
                if ($rootScope.currentUser.following[i]._id === userId) {
                    return true;
                }
            }
            return false;
        }

        function followUser() {
            UserService
                .followUser(vm.currentUser._id, userId)
                .then(
                    function(){
                        setUser(vm.currentUser._id);
                    },
                    function(err){
                        vm.error = err;
                    });
        }

        function unfollowUser() {
            UserService
                .unfollowUser(vm.currentUser._id, userId)
                .then(
                    function(){
                        setUser(vm.currentUser._id);
                    },
                    function(err){
                        vm.error = err;
                    });
        }

        function setUser(userId) {
            UserService
                .findUserById(userId)
                .then(
                    function(response){
                        UserService.setCurrentUser(response.data);
                        init();
                    },
                    function(err){
                        vm.error = err;
                    });
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
                        if (vm.user) {
                            vm.profilePic = vm.user.profilePic;
                        }
                    },
                    function (err) {
                        vm.error = err;
                    }
                );
            $scope.toggleText = $scope.toggle ? 'Follow' : 'Following';
        }
        init();

        function follow() {
            
        }

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

        function updateUser(user) {
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