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
        vm.sorted = sorted;

        function sorted(startIndex, endIndex) {
            WidgetService
                .reorderWidget(pageId, startIndex, endIndex)
                .then(function (res) {
                    // vm.widgets = res.data;
                    init();
                })

        }

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
            WidgetService
                .findWidgetsByPageId(pageId)
                .then(function (res) {
                    vm.widgets = res.data;
                    // $(".container")
                    //     .sortable({axis: "y"});
                });
        }
        init();
    }
})();