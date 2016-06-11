module.exports = function (app, models) {

    var pageModel = models.pageModel;
    var websiteModel = models.websiteModel;

    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    function deletePage(req, res) {
        var pageId = req.params.pageId;
        pageModel
            .findPageById(pageId)
            .then(
                function (page) {
                    var websiteId = page._website;
                    pageModel
                        .deletePage(pageId)
                        .then(
                            function () {
                                websiteModel
                                    .splicePage(websiteId, pageId)
                                    .then(
                                        function () {
                                            res.sendStatus(200);
                                        }
                                    );
                            },
                            function (error) {
                                res.send(error);
                            }
                        )
                }
            )

    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var page = req.body;
        pageModel
            .updatePage(pageId, page)
            .then(
                function () {
                    res.json(page);
                },
                function (error) {
                    res.send(error);
                }
            )
    }

    function findPageById(req, res) {
        var pageId = req.params.pageId;
        pageModel
            .findPageById(pageId)
            .then(
                function (page) {
                    res.json(page);
                },
                function (error) {
                    res.send(error);
                }
            );
    }

    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var page = req.body;
        if (page && page.name) {
            pageModel
                .createPage(websiteId, page)
                .then(function (newPage) {
                        websiteModel
                            .populatePage(websiteId, newPage)
                            .then(
                                function () {
                                    res.json(newPage);
                                },
                                function (error) {
                                    res.send(error);
                                }
                            )


                            // res.json(page);
                        },
                        function (error) {
                            res.json(error);
                        }
                );
        }

    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        pageModel
            .findAllPagesForWebsite(websiteId)
            .then(
                function (pages) {
                    res.json(pages)
                },
                function (error) {
                    res.send(error);
                }
            );
    }
};