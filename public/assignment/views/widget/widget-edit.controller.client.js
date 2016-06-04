(function () {
    angular
        .module("WebAppMaker")
        .controller("EditWidgetController", EditWidgetController);
    
    function EditWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        var userId = $routeParams.uid;
        vm.userId = userId;
        var websiteId = $routeParams.wid;
        vm.websiteId = websiteId;
        var pageId = $routeParams.pid;
        vm.pageId = pageId;
        var widgetId = $routeParams.wgid;
        vm.widgetId = widgetId;

        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function updateWidget(widget) {
            WidgetService
                .updateWidget(widgetId, widget)
                .then(function (res) {
                    var result = res.data;
                    if (result) {
                        $location.url("user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget")
                    } else {
                        switch (widget.widgetType) {
                            case "HEADER":
                                vm.error = "Failed to create a widget, text and size are required";
                                break;
                            case "IMAGE":
                                vm.error = "Failed to create a widget, url and width are required";
                                break;
                            case "YOUTUBE":
                                vm.error = "Failed to create a widget, url and size are required";
                                break;
                        }
                    }
                });
        }

        function deleteWidget() {
            var res = WidgetService.deleteWidget(widgetId);
            if (res) {
                $location.url("user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget")
            } else {
                vm.error = "Failed to delete a widget";
            }
        }

        function init() {
            WidgetService
                .findWidgetById(widgetId)
                .then(function (res) {
                    var widget = res.data;
                    if (widget) {
                        vm.widget = widget;
                    }
                });
        }
        init();
    }
})();