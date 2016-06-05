(function () {
    angular
        .module("WebAppMaker")
        .controller("FlickrImageSearchController", FlickrImageSearchController);
    
    function FlickrImageSearchController($location, $routeParams, FlickrService, WidgetService) {
        var vm = this;
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;
        var userId = $routeParams.uid;
        vm.userId = userId;
        var websiteId = $routeParams.wid;
        vm.websiteId = websiteId;
        var pageId = $routeParams.pid;
        vm.pageId = pageId;
        var widgetId = $routeParams.wgid;
        vm.widgetId = widgetId;
        
        function searchPhotos(searchTerm) {
            FlickrService
                .searchPhotos(searchTerm)
                .then(function(response) {
                    var data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });

        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            WidgetService
                .findWidgetById(widgetId)
                .then(function (res) {
                    var widget = res.data;
                    widget.url = url;
                    WidgetService
                        .updateWidget(widgetId, widget)
                        .then(function (res) {
                            var result = res.data;
                            if (result) {
                                $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
                            } else {
                                $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);

                            }
                        });

                });
        }
    }
})();