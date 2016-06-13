(function () {

    // add a directive called wam-directives
    // to a module called WebAppMaker
    angular
        .module("wamDirectives", [])
        .directive("wamSortable", wamSortable);

    // implement the directive in the following function
    function wamSortable() {
        function linker(scope, element, attributes) {
            var data = scope.data;
            var startIndex = -1;
            var endIndex = -1;
            $(element)
                .find(".sortableWidgets")
                .sortable({
                    axis: "y",
                    start: function (event, ui) {
                        startIndex = ui.item.index();
                    },
                    stop: function (event, ui) {
                        endIndex = ui.item.index();

                        var sortedElement = scope.data.widgets.splice(startIndex, 1)[0];
                        scope.data.widgets.splice(endIndex, 0, sortedElement);
                        scope.$apply();
                        scope.sorted({start: startIndex, end: endIndex});
                    }
                });
        }

        return {
            templateUrl: "/assignment/directives/wam-directives.html",
            scope: {
                data: "=",
                title: "=",
                sorted: '&'
            },
            link: linker

        }
    }
})();