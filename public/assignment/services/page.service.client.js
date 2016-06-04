(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);
    function PageService($http) {

        var api = {
            createPage : createPage,
            findPageByWebsiteId : findPageByWebsiteId,
            findPageById : findPageById,
            updatePage : updatePage,
            deletePage : deletePage
        };
        return api;

        function createPage(websiteId, newPage) {
            if (newPage && newPage.name) {
                var page = {
                    name : newPage.name,
                    title : newPage.title,
                    websiteId : websiteId
                };
                var url = "/api/website/" + websiteId + "/page";
                return $http.post(url, page);
            } else {
                var url = "/api/website/" + websiteId + "/page";
                return $http.post(url, null);
            }

        }

        function findPageByWebsiteId(websiteId) {
            var url = "/api/website/" + websiteId + "/page";
            return $http.get(url);
        }

        function findPageById(pageId) {
            var url = "/api/page/" + pageId;
            return $http.get(url);
        }

        function updatePage(pageId, page) {
            var url = "/api/page/" + pageId;
            return $http.put(url, page);
        }

        function deletePage(pageId) {
            var url = "/api/page/" + pageId;
            return $http.delete(url);
        }
    }
})();