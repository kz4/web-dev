(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController);
    
    function WidgetListController($sce, $routeParams, WidgetService) {
        var vm = this;
        var userId = $routeParams.uid;
        vm.userId = userId;
        var websiteId = $routeParams.wid;
        vm.websiteId = websiteId;
        var pageId = $routeParams.pid;
        vm.pageId = pageId;

        vm.getSafeHtml = getSafeHtml;
        vm.getSafeUrl = getSafeUrl;

        function getSafeHtml(widget) {
            return $sce.trustAsHtml(widget.text);
        }

        function getSafeUrl(widget) {
            var urlParts = widget.url.split("/");
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
        }

        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(pageId);
        }
        init();
    }
})();