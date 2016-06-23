(function () {
    angular
        .module("ProjectMaker")
        .controller("RestaurantInfoController", RestaurantInfoController);
     
    function RestaurantInfoController($sce, $routeParams, RestaurantService, UserService, $location, $rootScope) {
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

        var isUserLoggedIn = false;
        vm.isReplyACommentButtonClicked = false;
        vm.isReplyAReplyButtonClicked = false;
        // vm.isThisReplyCommentAreaShown = false;
        
        // var commentIndex = 0;

        var comments = [];
        vm.comments = comments;
        
        function cancelAReplyToAReply() {
            vm.isReplyAReplyButtonClicked = false;
            for (var i in comments) {
                comments[i].isThisReplyCommentAreaShown = false;
                for (var j = 0; j < comments[i].replies.length; j++) {
                    if (comments[i].replies[j]) {
                        comments[i].replies[j].isThisReplyReplyAreaShown = false;
                    }
                }
            }
        }
        
        function submitAReplyToAReply(replyToAReply, commentId, replierId, replier, parentIndex) {
            if(isUserLoggedIn) {
                var newReplyToAComment = {
                    "replierId": $rootScope.currentUser._id,
                    "replier": $rootScope.currentUser.username,
                    "hostId": "HostID",
                    "host": "Some host",
                    "date": new Date().toString(),
                    "content": replyToAReply,
                    isThisReplyCommentAreaShown: false,
                    isThisReplyReplyAreaShown: false
                };
                comments[parentIndex].replies.push(newReplyToAComment);
                vm.isReplyACommentButtonClicked = false;
                vm.isReplyAReplyButtonClicked = false;
                for (var i in comments) {
                    comments[i].isThisReplyCommentAreaShown = false;
                    for (var j = 0; j < comments[i].replies.length; j++) {
                        if (comments[i].replies[j]) {
                            comments[i].replies[j].isThisReplyReplyAreaShown = false;
                        }
                    }
                }
            } else {
                vm.isReplyACommentButtonClicked = false;
                $location.url("/login");
            }
        }

        function replyAReply(commentId, replierId, replier, index, parentIndex) {
            vm.isReplyAReplyButtonClicked = true;
            // for (var i in comments) {
                // if (comments[i].commentIndex === parentIndex) {
            for (var i = 0; i < comments.length; i++) {
                if (i === parentIndex) {
                    for (var j = 0; j < comments[i].replies.length; j++) {
                        if (index === j) {
                            comments[i].replies[j].isThisReplyReplyAreaShown = true;
                        }
                    }
                }
            }
        }

        function cancelAReplyToAComment(commentId, replyHostId, replyHost, commentIndex) {
            vm.isReplyACommentButtonClicked = false;
            for (var i in comments) {
                comments[i].isThisReplyCommentAreaShown = false;
                for (var j = 0; j < comments[i].replies.length; j++) {
                    if (comments[i].replies[j]) {
                        comments[i].replies[j].isThisReplyReplyAreaShown = false;
                    }
                }
            }
        }
        
        function submitAReplyToAComment(replyToAComment, commentId, replyHostId, replyHost, commentIndex) {
            if(isUserLoggedIn) {

                // selectedCommentIndex = commentIndex;
                // currentCommentId = angular.copy(commentId);
                // currentReplyHostId = angular.copy(replyHostId);
                // currentReplyHost = angular.copy(replyHost);
                // $scope.commentPlaceholder = "reply to " + replyHost + "..";
                // $scope.commentBtnText = "Reply";
                // $anchorScroll("anchor");
                var newReplyToAComment = {
                    "replierId": $rootScope.currentUser._id,
                    "replier": $rootScope.currentUser.username,
                    "hostId": replyHostId,
                    "host": replyHost,
                    "date": new Date().toString(),
                    "content": replyToAComment,
                    isThisReplyCommentAreaShown: false,
                    isThisReplyReplyAreaShown: false
                };
                comments[commentIndex].replies.push(newReplyToAComment);
                vm.isReplyACommentButtonClicked = false;
                for (var i in comments) {
                    comments[i].isThisReplyCommentAreaShown = false;
                    for (var j = 0; j < comments[i].replies.length; j++) {
                        if (comments[i].replies[j]) {
                            comments[i].replies[j].isThisReplyReplyAreaShown = false;
                        }
                    }
                }
            } else {
                vm.isReplyACommentButtonClicked = false;
                $location.url("/login");
            }
        }

        function replyAcomment(commentId, replyHostId, replyHost, commentIndex) {
            vm.isReplyACommentButtonClicked = true;
            // for (var i in comments) {
            for (var i = 0; i < comments.length; i++) {
                // if (comments[i].commentIndex === commentIndex) {
                if (i === commentIndex) {
                    comments[i].isThisReplyCommentAreaShown = true;
                }
            }
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
                        "replies":[]
                    };
                    // commentIndex++;
                    comments.push(newComment);
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
                               var categories = restaurant.categories.map(selectUpperCase).join(", ")
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
                           }
                       })
               );

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
                   function (err) {
                       $location.url("/login");
                   });
       }
       init();
    }

})();