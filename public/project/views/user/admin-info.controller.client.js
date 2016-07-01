(function () {
    angular
        .module("ProjectMaker")
        .controller("AdminInfoController", AdminInfoController);

    function AdminInfoController($location, $rootScope, UserService, $routeParams, $scope) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUserAndAllInfo = deleteUserAndAllInfo;
        vm.logout = logout;
        var currentUser = $rootScope.currentUser;
        vm.currentUser = currentUser;
        vm.hasProfilePicture = hasProfilePicture;
        vm.isLoggedIn = isLoggedIn;
        vm.isCurrentUserSameAsProfile = isCurrentUserSameAsProfile;

        vm.editUser = editUser;
        vm.getLongDateTime = getLongDateTime;


        var userId = $routeParams.uid;

        function getLongDateTime(timeString) {
            var date = new Date(timeString);
            var dateOri = date.toDateString();
            var dateLiteral = dateOri.substring(4, 7) + " " + date.getDate() + ", " + dateOri.slice(-2);
            var time = new Date(timeString);
            var hours = time.getHours();
            var minutes = time.getMinutes();
            if(hours < 10) {
                hours = "0" + hours;
            }
            if(minutes < 10) {
                minutes = "0" + minutes;
            }
            var timeLiteral = hours + ":" + minutes + " ";
            return timeLiteral + dateLiteral;
        }

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
                .findAllUsersWithPopulation()
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

        function deleteUserAndAllInfo(userId) {
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
            // var user = null;
            // UserService
            //     .findUserById(userId)
            //     .then(
            //         function (res) {
            //             var user = res.data;
            //             for (var i = 0; i < user.comments.length; i++) {
            //                 var replies = user.comments[i].replies;
            //                 for (var j = 0; j < replies.length; i++) {
            //                     ReplyService
            //                         .deleteReplyById(replies[j])
            //                         .then(
            //                             function (res) {
            //
            //                             }
            //                         )
            //                 }
            //                 CommentService
            //                     .deletCommentById(user.comments[i])
            //                     .then(
            //                         function (res) {
            //
            //                         }
            //                     )
            //             }
            //             UserService
            //                 .deleteUser(userId)
            //                 .then(
            //                     function () {
            //                         $location.url("admin");
            //                     },
            //                     function (res) {
            //                         var err = res.data;
            //                         vm.error = err;
            //                     }
            //                 )
            //         }
            //     )
        }
    }
})();