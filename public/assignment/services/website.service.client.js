(function () {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    function WebsiteService($http) {

        var api = {
            createWebsite : createWebsite,
            findWebsitesByUser : findWebsitesByUser,
            findWebsiteById : findWebsiteById,
            updateWebsite : updateWebsite,
            deleteWebsite : deleteWebsite
        };
        return api;

        function createWebsite(userId, newWebsite) {
            if (newWebsite && newWebsite.name) {
                var website = {
                    // _id : (new Date()).getTime()+"",
                    name : newWebsite.name,
                    description : newWebsite.description,
                    developerId : userId
                };
                return $http.post("/api/user/" + userId + "/website/", website);
            } else {
                return $http.post("/api/user/" + userId + "/website/", null);
            }
        }

        function findWebsitesByUser(userId) {
            var url = "/api/user/" + userId + "/website";
            return $http.get(url);
        }

        function findWebsiteById(websiteId) {
            // for (var i in websites) {
            //     if (websites[i]._id === websiteId)
            //         return websites[i];
            // }
            // return null;
            var url = "/api/website/" + websiteId;
            return $http.get(url);
        }

        function updateWebsite(websiteId, website) {
            // for (var i in websites) {
            //     if (websites[i]._id === websiteId) {
            //         websites[i].name = website.name;
            //         websites[i].description = website.description;
            //         return true;
            //     }
            // }
            // return false;
            var url = "/api/website/" + websiteId;
            return $http.put(url, website);
        }

        function deleteWebsite(websiteId) {
            // for (var i in websites) {
            //     if (websites[i]._id === websiteId) {
            //         websites.splice(i, 1);
            //         return true;
            //     }
            // }
            // return false;
            var url = "/api/website/" + websiteId;
            return $http.delete(url);
        }
    }
})();