(function () {
    angular
        .module("ProjectMaker")
        .factory("UserService", UserService);

    function UserService($http, $rootScope) {
        var api = {
            createUser: createUser,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findUserByCredentials: findUserByCredentials,
            updateUser: updateUser,
            deleteUser: deleteUser,
            login: login,
            logout: logout,
            loggedIn: loggedIn,
            register: register,
            followUser: followUser,
            unfollowUser: unfollowUser,
            getCurrentUser: getCurrentUser,
            getCurrentUsername: getCurrentUsername,
            setCurrentUser: setCurrentUser,
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin
        };
        return api;

        function setCurrentUser(user) {
            $rootScope.currentUser = user;
        }

        function getCurrentUser() {
            return $rootScope.currentUser;
        }

        function getCurrentUsername() {
            if (isLoggedIn()) {
                return $rootScope.currentUser.username;
            } else {
                return null;
            }
        }

        function followUser(followerId, followedId) {
            return $http.post("/api/project/user/"+followerId+"/user/"+followedId);
        }

        function unfollowUser(followerId, followedId) {
            return $http.put("/api/project/user/"+followerId+"/user/"+followedId);
        }

        function register(username, password, verifyPassword, isAdmin) {
            var userType = "NORMAL";
            if (isAdmin) {
                userType = "ADMIN";
            }
            var url = "/api/project/register";
            if (username) {
                if (password === verifyPassword) {
                    var user = {
                        username: username,
                        password: password,
                        userType: userType
                    };
                    return $http.post(url, user);
                }
            }
            return $http.post(url, null);
        }

        function loggedIn() {
            return $http.get("/api/loggedIn");
        }

        function isLoggedIn() {
            return ($rootScope.currentUser !== undefined && $rootScope.currentUser !== null);
        }

        function isAdmin() {
            return (isLoggedIn() && $rootScope.currentUser.roles.indexOf("admin") >= 0);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function login(username, password) {
            var user = {
                username: username,
                password: password
            };
            var url = "/api/login";
            return $http.post(url, user);
        }

        function createUser(username, password, verifyPassword) {
            if (username) {
                if (password === verifyPassword) {
                    var user = {
                        username: username,
                        password: password
                    };
                    return $http.post("/api/user", user);
                }
            }
            return $http.post("/api/user", null);
        }

        function findUserById(id) {
            var url = "/api/user/" + id;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = "/api/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        function updateUser(userId, user) {
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url, userId);
        }
    }
})();


