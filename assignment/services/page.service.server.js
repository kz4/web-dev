module.exports = function (app) {
    var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456" },
        { "_id": "432", "name": "Post 2", "websiteId": "456" },
        { "_id": "543", "name": "Post 3", "websiteId": "456" }
    ];

    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);
    
    function deletePage(req, res) {
        var pageId = req.params.pageId;
        for (var i in pages) {
            if (pages[i]._id === pageId) {
                pages.splice(i, 1);
                res.json(true);
                return;
            }
        }
        res.json(false);
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var page = req.body;
        var updatedPage;
        for (var i in pages) {
            if (pages[i].name === page.name) {
                res.json(false);
                return;
            }

            if (pages[i]._id === pageId) {
                updatedPage = pages[i];
            }
        }
        if (updatedPage) {
            updatedPage.name = page.name;
            updatedPage.title = page.title;
            res.json(true);
            return;
        } else {
            res.json(false);
            return;
        }
    }

    function findPageById(req, res) {
        var pageId = req.params.pageId;
        for (var i in pages) {
            if (pages[i]._id === pageId) {
                res.json(pages[i]);
                return;
            }
        }
        res.json({});
    }

    function createPage(req, res) {
        var page = req.body;
        if (page && page.name) {
            for (var i in pages) {
                if (pages[i].name === page.name) {
                    res.json({});
                    return;
                }
            }

            page._id = (new Date()).getTime()+"";
            pages.push(page);
            res.json(page);
        } else {
            res.json({});
        }
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var result = [];
        for (var i in pages) {
            if (pages[i].websiteId === websiteId) {
                result.push(pages[i]);
            }
        }
        res.json(result);
    }
};