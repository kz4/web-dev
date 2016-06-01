(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    function UserService($http) {

        // var users = [
        //     {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
        //     {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
        //     {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
        //     {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
        // ];

        var api = {
            createUser   : createUser,
            findUserById : findUserById,
            findUserByUsername : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser : updateUser,
            deleteUser : deleteUser
        };
        return api;

        function createUser(username, password, verifyPassword) {
            if (!!username) {
                ;
            } else {
                return null;
            }

            if (password !== verifyPassword) {
                return null;
            }

            for (var i in users) {
                if (users[i].username === username) {
                    return null;
                }
            }

            var user = {
                _id : (new Date()).getTime()+"",
                username : username,
                password : password
            };
            return $http.post("/api/user", user);
            // users.push(user);
            // return user;
        }

        function findUserById(id) {
            // for (var i in users) {
            //     if (users[i]._id === id)
            //         return users[i];
            // }
            // return null;
            var url = "/api/user/" + id;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            // for (var i in users) {
            //     if (users[i].username === username)
            //         return users[i];
            // }
            // return null;
            var url = "/api/user/" + id;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            // for (var i in users) {
            //     if (users[i].username === username && users[i].password === password)
            //         return users[i];
            // }
            // return null;
            var url = "/api/user?username="+username+"&password="+password;
            return $http.get(url);
        }

        function updateUser(userId, user) {
            // for (var i in users) {
            //     if (users[i]._id === userId) {
            //         users[i].firstName = user.firstName;
            //         users[i].lastName = user.lastName;
            //         return true;
            //     }
            // }
            // return false;
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            for (var i in users) {
                if (users[i]._id === userId) {
                    users.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
    }
})();


