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
        vm.followUnfollow = followUnfollow;
        // vm.toggleText = vm.toggle ? 'Toggle!' : 'some text';;
        // vm.toggle = true;
        var userId = $routeParams.uid;

        function followUnfollow() {

            if (isLoggedIn()) {
                // vm.currentUser._id is following userId
                if ($scope.toggle) {
                    UserService
                        .followUser(vm.currentUser._id, userId)
                        .then(
                            function(){
                                init();
                            },
                            function(err){
                                vm.error = err;
                            });
                    $scope.toggle = !$scope.toggle;
                    $scope.toggleText = $scope.toggle ? 'Follow' : 'Following';
                } else {
                    UserService
                        .unfollowUser(vm.currentUser._id, userId)
                        .then(
                            function(){
                                init();
                            },
                            function(err){
                                vm.error = err;
                            });
                    $scope.toggle = !$scope.toggle;
                    $scope.toggleText = $scope.toggle ? 'Follow' : 'Following';
                }
            }
        }

        $scope.toggle = true;

        // $scope.$watch('toggle', function(){
        //     $scope.toggleText = $scope.toggle ? 'Follow' : 'Following';
        // });

        // $scope.$watch('toggle', function(){
        //     $scope.toggleText = $scope.toggle ? 'Follow' : 'Following';
        //
        //     if (isLoggedIn()) {
        //         // vm.currentUser._id is following userId
        //         if (!$scope.toggle) {
        //             UserService
        //                 .followUser(vm.currentUser._id, userId)
        //                 .then(
        //                     function(){
        //                         init();
        //                     },
        //                     function(err){
        //                         vm.error = err;
        //                     });
        //         } else {
        //             UserService
        //                 .unfollowUser(vm.currentUser._id, userId)
        //                 .then(
        //                     function(){
        //                         init();
        //                     },
        //                     function(err){
        //                         vm.error = err;
        //                     });
        //         }
        //     }
        // });

        
        
        function isCurrentUserSameAsProfile() {
            var res = userId && vm.currentUser._id && (vm.currentUser._id === userId);
            return res;
        }

        function isLoggedIn() {
            var res = ($rootScope.currentUser !== undefined && $rootScope.currentUser !== null);
            return res;
        }

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