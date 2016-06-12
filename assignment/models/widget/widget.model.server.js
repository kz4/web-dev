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
        reorderWidget: reorderWidget,
    };
    return api;
    
    function reorderWidget() {
        
    }
    
    function deleteWidget(widgetId) {
        return Widget.remove({_id: widgetId});
    }
    
    function updateWidget(widgetId, widget) {
        // return Widget.update({_id: widgetId}, {
        //     $set:
        //     {
        //         name: widget.name,
        //         text: widget.text,
        //         placeholder: widget.placeholder,
        //         description: widget.description,
        //         url: widget.url,
        //         width: widget.width,
        //         height: widget.height,
        //         rows: widget.rows,
        //         size: widget.size,
        //         class: widget.class,
        //         icon: widget.icon,
        //         deletable: widget.deletable,
        //         formatted: widget.formatted
        //     }
        // });
        return Widget.update({_id: widgetId}, {$set: widget});
    }

    function findWidgetById(widgetId) {
        return Widget.findById(widgetId);
    }

    function findAllWidgetsForPage(pageId) {
        return Widget.find({_page: pageId});
    }

    function createWidget(pageId, widget) {
        widget._page = pageId;

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
            case 'INPUT':
                widget.widgetType = 'INPUT';
                break;
            default:
                break;
        }

        return Widget.create(widget);
    }
};