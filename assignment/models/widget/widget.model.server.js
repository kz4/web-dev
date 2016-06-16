module.exports = function () {

    var mongoose = require('mongoose');
    var WidgetSchema = require('./widget.schema.server')();
    var Widget = mongoose.model("Widget", WidgetSchema);

    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget
    };
    return api;

    function reorderWidget(startIndex, endIndex, pageId) {
        return Widget
            .find({_page: pageId})
            .then(
                function (widgets) {
                    for (var i in widgets) {
                        var widget = widgets[i];
                        if (startIndex >= endIndex) {
                            if (widget.order < startIndex && widget.order >= endIndex) {
                                widget.order++;
                                widget.save(function (err, doc) {
                                });
                            } else if (widget.order === startIndex) {
                                widget.order = endIndex;
                                widget.save(function (err, doc) {
                                });
                            }
                        } else {
                            if (widget.order > startIndex && widget.order <= endIndex) {
                                widget.order--;
                                widget.save(function (err, doc) {
                                });
                            } else if (widget.order === startIndex) {
                                widget.order = endIndex;
                                widget.save(function (err, doc) {
                                });
                            }
                        }
                    }
                });
    }

    function deleteWidget(widgetId) {
        return Widget.remove({_id: widgetId});
    }

    function updateWidget(widgetId, widget) {
        return Widget.update({_id: widgetId}, {
            $set:
            {
                name: widget.name || "",
                text: widget.text || "",
                placeholder: widget.placeholder || "",
                description: widget.description || "",
                url: widget.url || "",
                width: widget.width || "",
                height: widget.height || "",
                rows: widget.rows || 0,
                html: widget.html || "",
                size: widget.size || 0,
                class: widget.class || "",
                icon: widget.icon || "",
                deletable: widget.deletable || false,
                formatted: widget.formatted || false
            }
        });
    }

    function findWidgetById(widgetId) {
        return Widget.findById(widgetId);
    }

    function findAllWidgetsForPage(pageId) {
        return Widget.find({_page: pageId});
    }

    function createWidget(pageId, widget) {
        widget._page = pageId;
        // Widget.count({}, function( err, count){
        //     console.log( "Number of users:", count );
        // })

        switch (widget.widgetType) {
            case 'HEADING':
                widget.widgetType = 'HEADING';
                break;
            case 'IMAGE':
                widget.widgetType = 'IMAGE';
                break;
            case 'YOUTUBE':
                widget.widgetType = 'YOUTUBE';
                break;
            case 'HTML':
                widget.widgetType = 'HTML';
                break;
            case 'TEXT':
                widget.widgetType = 'TEXT';
                break;
            default:
                break;
        }

        // return Widget.create(widget);
        return Widget
            .find({_page: pageId})
            .then(
                function (widgets) {
                    widget.order = widgets.length;
                    return Widget.create(widget);
                },
                function (error) {
                    return null;
                }
            );
    }
};