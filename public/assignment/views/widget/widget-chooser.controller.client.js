(function () {
    angular
        .module("WebAppMaker")
        .controller("NewWidgetController", NewWidgetController);
    
    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        var userId = $routeParams.uid;
        vm.userId = userId;
        var websiteId = $routeParams.wid;
        vm.websiteId = websiteId;
        var pageId = $routeParams.pid;
        vm.pageId = pageId;

        vm.createHeaderWidget = createHeaderWidget;
        vm.createImageWidget = createImageWidget;
        vm.createYoutubeWidget = createYoutubeWidget;
        vm.createHtmlWidget = createHtmlWidget;
        vm.createTextWidget = createTextWidget;

        function createTextWidget() {
            var widget = {
                widgetType : "TEXT"
            };
            WidgetService
                .createWidget(pageId, widget)
                .then(function (res) {
                    var result = res.data;
                    if (result._id) {
                        $location.url("user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + result._id);
                    } else {
                        vm.error = "Failed to create a TEXT widget";
                    }
                });
        }

        function createHtmlWidget() {
            var widget = {
                widgetType : "HTML"
            };
            WidgetService
                .createWidget(pageId, widget)
                .then(function (res) {
                    var result = res.data;
                    if (result._id) {
                        $location.url("user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + result._id);
                    } else {
                        vm.error = "Failed to create a HTML widget";
                    }
                });
        }

        function createHeaderWidget() {
            var widget = {
                widgetType : "HEADING"
            };
            WidgetService
                .createWidget(pageId, widget)
                .then(function (res) {
                    var result = res.data;
                    if (result._id) {
                        $location.url("user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + result._id);
                    } else {
                        vm.error = "Failed to create a header widget";
                    }
                });
        }

        function createImageWidget() {
            var widget = {
                widgetType : "IMAGE"
            };
            WidgetService
                .createWidget(pageId, widget)
                .then(function (res) {
                    var result = res.data;
                    if (result._id) {
                        $location.url("user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + result._id);
                    } else {
                        vm.error = "Failed to create a image widget";
                    }
                });
        }

        function createYoutubeWidget() {
            var widget = {
                widgetType : "YOUTUBE"
            };
            WidgetService
                .createWidget(pageId, widget)
                .then(function (res) {
                    var result = res.data;
                    if (result._id) {
                        $location.url("user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + result._id);
                    } else {
                        vm.error = "Failed to create a youtube widget";
                    }
                });
        }
    }
})();