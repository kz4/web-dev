(function () {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    function WebsiteService() {
        var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456" },
            { "_id": "234", "name": "Tweeter",     "developerId": "456" },
            { "_id": "456", "name": "Gizmodo",     "developerId": "456" },
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123" },
            { "_id": "678", "name": "Checkers",    "developerId": "123" },
            { "_id": "789", "name": "Chess",       "developerId": "234" }
        ];

        var api = {
            createWebsite : createWebsite,
            findWebsitesByUser : findWebsitesByUser,
            findWebsiteById : findWebsiteById,
            updateWebsite : updateWebsite,
            deleteWebsite : deleteWebsite
        };
        return api;

        function createWebsite(userId, name) {
            if (!!name) {
                ;
            } else {
                return null;
            }

            for (var i in websites) {
                if (websites[i].name === name) {
                    return null;
                }
            }

            var website = {
                _id : (new Date()).getTime()+"",
                name : name,
                developerId : userId
            };
            websites.push(website);
            return website;
        }

        function findWebsitesByUser(userId) {
            var res = [];
            for (var i in websites) {
                if (websites[i].developerId === userId) {
                    res.push(websites[i]);
                }
            }
            return res;
        }

        function findWebsiteById(websiteId) {
            for (var i in websites) {
                if (websites[i]._id === websiteId)
                    return websites[i];
            }
            return null;
        }

        function updateWebsite(websiteId, website) {
            for (var i in websites) {
                if (websites[i]._id === websiteId) {
                    websites[i].name = website.name;
                    websites[i].developerId = website.developerId;
                    return true;
                }
            }
            return false;
        }

        function deleteWebsite(websiteId) {
            for (var i in websites) {
                if (websites[i]._id === websiteId) {
                    websites.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
    }
})();