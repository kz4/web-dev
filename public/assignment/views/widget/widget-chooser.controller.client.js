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

        function createHeaderWidget() {
            var widgetId = (new Date()).getTime()+"";
            var widget = {
                _id : widgetId,
                widgetType : "HEADER",
                pageId : pageId
            };
            var res = WidgetService.createWidget(pageId, widget);
            if (res) {
                $location.url("user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
            } else {
                vm.error = "Failed to create a header widget";
            }
        }

        function createImageWidget() {
            var widgetId = (new Date()).getTime()+"";
            var widget = {
                _id : widgetId,
                widgetType : "IMAGE",
                pageId : pageId
            };
            var res = WidgetService.createWidget(pageId, widget);
            if (res) {
                $location.url("user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
            } else {
                vm.error = "Failed to create a image widget";
            }
        }

        function createYoutubeWidget() {
            var widgetId = (new Date()).getTime()+"";
            var widget = {
                _id : widgetId,
                widgetType : "YOUTUBE",
                pageId : pageId
            };
            var res = WidgetService.createWidget(pageId, widget);
            if (res) {
                $location.url("user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
            } else {
                vm.error = "Failed to create a youtube widget";
            }
        }
    }
})();