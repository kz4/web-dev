(function () {
    angular
        .module("ProjectMaker")
        .controller("RestaurantInfoController", RestaurantInfoController);

    function RestaurantInfoController($sce, $routeParams, RestaurantService, UserService, $location, $rootScope, CommentService, ReplyService) {
        var vm = this;
        var categoryId = $routeParams.categoryId;
        vm.categoryId = categoryId;
        var zip = $routeParams.zip;
        vm.zip = zip;
        var restaurantId = $routeParams['restaurantId'];
        vm.restaurantId = restaurantId;

        vm.leaveAComment = leaveAComment;
        vm.getLongDateTime = getLongDateTime;
        vm.replyAcomment = replyAcomment;
        vm.submitAReplyToAComment = submitAReplyToAComment;
        vm.cancelAReplyToAComment = cancelAReplyToAComment;
        vm.replyAReply = replyAReply;
        vm.submitAReplyToAReply = submitAReplyToAReply;
        vm.cancelAReplyToAReply = cancelAReplyToAReply;

        vm.findRepliesByCommentId = findRepliesByCommentId;
        vm.findReplyByReplyId = findReplyByReplyId;

        vm.currentUser = $rootScope.currentUser;
        vm.logout = logout;

        vm.cannotAddToFavorite = cannotAddToFavorite;
        vm.canDeleteFromFavorite = canDeleteFromFavorite;
        vm.addRestaurantToFavorite = addRestaurantToFavorite;
        vm.removeRestaurantFromFavorite = removeRestaurantFromFavorite;

        function addRestaurantToFavorite() {
            RestaurantService
                .findRestaurantByYelpRestaurantIdInDB(restaurantId)
                .then(
                    function (res) {
                        var restaurant = res.data;
                        if (restaurant && restaurant.length > 0) {
                            RestaurantService
                                .addRestaurantToFavorite(restaurantId, vm.currentUser._id)
                                .then(
                                    function () {
                                        setUser(vm.currentUser._id);
                                    },
                                    function (err) {
                                        vm.error = err;
                                    }
                                )
                        } else {
                            RestaurantService
                                .createRestaurantToFavorite(restaurantId, vm.currentUser._id)
                                .then(
                                    function () {
                                        setUser(vm.currentUser._id);
                                    },
                                    function (err) {
                                        vm.error = err;
                                    }
                                )
                        }
                    },
                    function (err) {
                        vm.error = err;
                    }
                )

        }

        function removeRestaurantFromFavorite() {
            RestaurantService
                .removeRestaurantFromFavorite(restaurantId, vm.currentUser._id)
                .then(
                    function () {
                        setUser(vm.currentUser._id);
                    },
                    function (err) {
                        vm.error = err;
                    }
                )
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

        function cannotAddToFavorite() {
            if (!vm.users && isLoggedIn()) {
                return false;
            }
            
            if (vm.users && $rootScope.currentUser) {
                for (var i = 0; i < vm.users.length; i++) {
                    if (vm.users[i]._id === $rootScope.currentUser._id) {
                        return true;
                    }
                }
                return !isLoggedIn();
                // return (!isLoggedIn() // not loggedIn
                // || (vm.users.users.indexOf($rootScope.currentUser._id) >= 0)); // OR has liked this restaurant
            } else {
                return true;
            }
        }

        function canDeleteFromFavorite() {
            if (vm.users && $rootScope.currentUser) {
                for (var i = 0; i < vm.users.length; i++) {
                    if (vm.users[i]._id === $rootScope.currentUser._id) {
                        return isLoggedIn();
                    }
                }
                // return (isLoggedIn() // loggedIn
                // && (vm.users.users.indexOf($rootScope.currentUser._id) >= 0)); // AND has liked this restaurant
            } else {
                return false;
            }
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
                    function () {
                        $location.url("/login");
                    },
                    function () {
                        $location.url("/login");
                    }
                );
        }

        function findReplyByReplyId(replyId) {

        }

        function findRepliesByCommentId(commetId) {
            ReplyService
                .findRepliesByCommentId(commetId)
                .then(
                    function (replies) {
                        vm.replies = replies;
                    }
                )
        }

        var isUserLoggedIn = false;

        var comments = [];

        function cancelAReplyToAReply(index, parentIndex) {
            // for (var i in comments) {
            //     comments[i].isThisReplyCommentAreaShown = false;
            //     for (var j = 0; j < comments[i].replies.length; j++) {
            //         if (comments[i].replies[j]) {
            //             comments[i].replies[j].isThisReplyReplyAreaShown = false;
            //         }
            //     }
            // }
            for (var i = 0; i < comments.length; i++) {
                if (i === parentIndex) {
                    for (var j = 0; j < comments[i].replies.length; j++) {
                        if (j === index) {
                            comments[i].replies[j].isThisReplyReplyAreaShown = false;
                        }
                    }
                }
            }
        }

        function submitAReplyToAReply(replyToAReply, commentId, replierId, replier, index, parentIndex) {
            if(isUserLoggedIn) {
                var newReplyToAComment = {
                    "replierId": $rootScope.currentUser._id,
                    "replier": $rootScope.currentUser.username,
                    "hostId": "HostID",
                    "host": "Some host",
                    "date": new Date().toString(),
                    "content": replyToAReply,
                    "isThisReplyCommentAreaShown": false,
                    "isThisReplyReplyAreaShown": false
                };
                comments[parentIndex].replies.push(newReplyToAComment);
                // for (var i in comments) {
                //     comments[i].isThisReplyCommentAreaShown = false;
                //     for (var j = 0; j < comments[i].replies.length; j++) {
                //         if (comments[i].replies[j]) {
                //             comments[i].replies[j].isThisReplyReplyAreaShown = false;
                //         }
                //     }
                // }
                for (var i = 0; i < comments.length; i++) {
                    if (i === parentIndex) {
                        for (var j = 0; j < comments[i].replies.length; j++) {
                            if (j === index) {
                                comments[i].replies[j].isThisReplyReplyAreaShown = false;
                            }
                        }
                    }
                }
            } else {
                $location.url("/login");
            }
        }

        function replyAReply(commentId, replyId, replierId, replier, index, parentIndex) {
            // for (var i = 0; i < comments.length; i++) {
            //     if (i === parentIndex) {
            //         for (var j = 0; j < comments[i].replies.length; j++) {
            //             if (index === j) {
            //                 comments[i].replies[j].isThisReplyReplyAreaShown = true;
            //             }
            //         }
            //     }
            // }
            ReplyService
                .getReplyByReplyId(replyId)
                .then(
                    function (reply) {
                        reply.isThisReplyReplyAreaShown = true;
                    },
                    function (err){
                        vm.error = err;
                    }
                )
                .then(
                    function (reply) {
                        ReplyService
                            .updateReply(commentId, replyId, reply)
                            .then(function (response) {

                                },
                                function (err) {
                                    vm.error = err;
                                })
                    }
                )

        }

        function cancelAReplyToAComment(commentId, replyHostId, replyHost, commentIndex) {
            CommentService
                .findCommentByCommentId(commentId)
                .then(
                    function (res) {
                        var comment = res.data;
                        comment.isThisReplyCommentAreaShown = false;
                        CommentService
                            .updateComment(commentId, comment)
                            .then(
                                function () {
                                    vm.comment = null;
                                    vm.commentPlaceholder = "Please leave a comment...";
                                    refreshPage();
                                }
                            )
                    },
                    function (err) {
                        vm.error = err;
                    }
                )


            // for (var i = 0; i < comments.length; i++) {
            //     if (i === commentIndex) {
            //         comments[i].isThisReplyCommentAreaShown = false;
            //     }
            // }
        }

        function submitAReplyToAComment(replyToAComment, commentId, replyHostId, replyHost, commentIndex) {
            if(isUserLoggedIn) {
                // $anchorScroll("anchor");
                var newReplyToAComment = {
                    "replierId": $rootScope.currentUser._id,
                    "replier": $rootScope.currentUser.username,
                    "hostId": replyHostId,
                    "host": replyHost,
                    "date": new Date().toString(),
                    "content": replyToAComment,
                    "isThisReplyCommentAreaShown": false,
                    "isThisReplyReplyAreaShown": false
                };
                // comments[commentIndex].replies.push(newReplyToAComment);
                // for (var i = 0; i < comments.length; i++) {
                //     if (i === commentIndex) {
                //         comments[i].isThisReplyCommentAreaShown = false;
                //     }
                // }
                ReplyService
                    .createReply(commentId, newReplyToAComment)
                    .then(
                        function (res) {
                            var newReplyRes = res.data;
                            var newReplyId = newReplyRes._id;
                            vm.comment = null;
                            vm.commentPlaceholder = "Please leave a comment...";
                            refreshPage(restaurantId);
                        },
                        function (err) {
                            vm.error = err;
                        }
                    );

                // CommentService
                //     .updateComment(commentId, )
                //     .then(
                //         function (response) {
                //
                //         },
                //         function (err) {
                //             vm.error = err;
                //         }
                //     )

            } else {
                $location.url("/login");
            }
        }

        function replyAcomment(commentId, replyHostId, replyHost, commentIndex) {

            // for (var i = 0; i < comments.length; i++) {
            //     if (i === commentIndex) {
            //         comments[i].isThisReplyCommentAreaShown = true;
            //         CommentService
            //             .updateComment(commentId, comments[i])
            //             .then(
            //                 function (res) {
            //
            //                 },
            //                 function (err) {
            //                     vm.error = err;
            //                 }
            //             )
            //     }
            // }
            // var comment = null;
            CommentService
                .findCommentByCommentId(commentId)
                .then(function (res) {
                    var comment = res.data;
                    comment.isThisReplyCommentAreaShown = true;
                    CommentService
                        .updateComment(commentId, comment)
                        .then(
                            function () {
                                vm.comment = null;
                                vm.commentPlaceholder = "Please leave a comment...";
                                refreshPage(restaurantId);
                            },
                            function (err) {
                                vm.error = err;
                            }
                        )
                });
        }

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

        function leaveAComment(comment) {
            if (isUserLoggedIn) {
                if (comment) {
                    var newComment = {
                        "date": new Date().toString(),
                        "categoryId": categoryId,
                        "zip": zip,
                        "restaurantId": restaurantId,
                        // "commentIndex": commentIndex,
                        "commenterId": $rootScope.currentUser._id,
                        "commenter": $rootScope.currentUser.username,
                        "content": comment,
                        "isThisReplyCommentAreaShown": false,
                        "replies":[]
                    };
                    CommentService
                        .createComment(newComment)
                        .then(function (res) {
                            var returnedComment = res.data;
                            vm.comment = null;
                            vm.commentPlaceholder = "Please leave a comment...";
                            refreshPage(restaurantId);
                        })
                }
            } else {
                $location.url("/login");
            }
        }

        /*
         * Yelp provides two version, array[0] is uppercase, array[1] is lowercase
         */
        function selectUpperCase(array) {
            return array[0];
        }

        function getSafeUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function init() {
            var keyUrl = "";
            RestaurantService
                .getGoogleMapKey()
                .then(function (res) {
                    var googleMapKey = res.data;
                    keyUrl = "&key=" + googleMapKey;
                })
                .then(
                    RestaurantService
                        .findRestaurantByYelpRestaurantId(restaurantId)
                        .then(function (res) {
                            var restaurant = res.data;
                            if (restaurant) {
                                vm.restaurant = restaurant;
                                var categories = restaurant.categories.map(selectUpperCase).join(", ");
                                vm.categories = categories;

                                var location = restaurant.location.display_address.join(", ");
                                vm.location = location;
                                var imageUrl = restaurant.image_url.substring(0, restaurant.image_url.lastIndexOf("ms"))
                                    + 'o.jpg';
                                vm.image = imageUrl;

                                var googleMapSrc = "https://www.google.com/maps/embed/v1/place?q="
                                    + restaurant.location.coordinate.latitude + ","
                                    + restaurant.location.coordinate.longitude
                                    + keyUrl;
                                vm.googleMapSrc = getSafeUrl(googleMapSrc);

                                // vm.comment = null;
                                vm.commentPlaceholder = "Please leave a comment...";
                            }
                        })
                );

            RestaurantService
                .findAllUsersThatFavoredThisRestaurant(restaurantId)
                .then(
                    function (res) {
                        var restaurant = res.data;
                        if (restaurant) {
                            vm.restaurant = restaurant;
                            vm.users = vm.restaurant.users;
                        }
                    },
                    function (err) {

                    });

            UserService
                .loggedIn()
                .then(
                    function (res) {
                        var user = res.data;
                        if (user == '0') {
                            $rootScope.currentUser = null;
                            // deferred.reject();
                            // $location.url("/login");
                            isUserLoggedIn = false;
                        } else {
                            $rootScope.currentUser = user;
                            isUserLoggedIn = true;
                        }
                    },
                    function () {
                        $location.url("/login");
                    });
            refreshPage(restaurantId);
        }
        init();

        function refreshPage(restaurantId){
            CommentService
                .getAllComments(restaurantId)
                .then(
                    function (res) {
                        var comments = res.data;
                        vm.comments = comments;

                        // for (var i = 0; i < comments.length; i++) {
                        //     findRepliesByCommentId(comments[i]._id);
                        // }
                    },
                    function (err) {
                        vm.error = err;
                    }
                )
        }
    }

})();