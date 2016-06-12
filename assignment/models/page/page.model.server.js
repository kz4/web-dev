module.exports = function () {

    var mongoose = require('mongoose');
    var PageSchema = require("./page.schema.server")();
    var Page = mongoose.model("Page", PageSchema);

    var api = {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage,
        populateWidget: populateWidget,
        spliceWidget: spliceWidget
    };
    return api;

    function spliceWidget(pageId, widgetId) {
        return Page.findOne({_id: pageId},
            function (err, doc) {
                doc.widgets.pull(widgetId);
                doc.save();
            });
    }

    function populateWidget(pageId, widget) {
        return Page.findOne({_id: pageId},
            function (err, doc) {
                doc.widgets.push(widget);
                doc.save();
            }
        );
    }

    function deletePage(pageId) {
        return Page.remove({_id: pageId});
    }

    function updatePage(pageId, page) {
        return Page.update({_id: pageId}, {
           $set: {
               name: page.name,
               title: page.title,
               description: page.description
           }
        });
    }

    function findPageById(pageId) {
        return Page.findById(pageId);
    }

    function findAllPagesForWebsite(websiteId) {
        return Page.find({_website: websiteId});
    }

    function createPage(websiteId, page) {
        page._website = websiteId;
        return Page.create(page);
    }
};
