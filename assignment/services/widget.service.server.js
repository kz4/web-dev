module.exports = function (app, models) {
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    var pageModel = models.pageModel;
    var widgetModel = models.widgetModel;

    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    app.put ("/api/page/:pageId/widget", reorderWidget);

    function reorderWidget(req, res) {
        var pageId = req.params.pageId;
        var startIndex = parseInt(req.query.start);
        var endIndex = parseInt(req.query.end);

        widgetModel
            .reorderWidget(startIndex, endIndex, pageId)
            .then(
                function () {
                    res.sendStatus(200);
                },
                function () {
                    res.sendStatus(400);
                }
            );
    }

    function uploadImage(req, res) {
        var widgetId = req.body.widgetId;
        var pageId = req.body.pageId;
        var websiteId = req.body.websiteId;
        var userId = req.body.userId;
        var width = req.body.width;

        var myFile        = req.file;

        if(myFile == null) {
            res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
            return;
        }

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        widgetModel
            .findWidgetById(widgetId)
            .then(
                function (widget) {
                    widget.url = "/uploads/" + filename;
                    widgetModel
                        .updateWidget(widgetId, widget)
                        .then(
                            function () {
                                res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
                            },
                            function (error) {
                                res.send(error);
                            }
                        );
                },
                function (err) {
                    res.send(err);
                }
            );


    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        widgetModel
            .findWidgetById(widgetId)
            .then(
                function (widget) {
                    var pageId = widget._page;
                    widgetModel
                        .deleteWidget(widgetId)
                        .then(
                            function () {
                                pageModel
                                    .spliceWidget(pageId, widgetId)
                                    .then(
                                        function () {
                                            res.sendStatus(200);
                                        },
                                        function (error) {
                                            res.send(error);
                                        }
                                    );
                            },
                            function (error) {
                                res.send(error);
                            }
                        );

                }
            )

    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var widget = req.body;

        switch (widget.widgetType) {
            case "HEADING":
                if (widget.text && widget.size) {    // for header
                    return updateWidgetHelper(widget, widgetId, res)
                }
                break;
            case "IMAGE":
                // if (widget.url && widget.width) {
                if (widget.url) {
                    return updateWidgetHelper(widget, widgetId, res)
                }
                break;
            case "YOUTUBE":
                if (widget.url && widget.width) {
                    return updateWidgetHelper(widget, widgetId, res);
                }
                break;
            case "HTML":
                if (widget.html) {
                    return updateWidgetHelper(widget, widgetId, res);
                }
                break;
            case "TEXT":
                if (widget) {
                    return updateWidgetHelper(widget, widgetId, res);
                }
                break;
        }
        res.json(false);
    }

    function updateWidgetHelper(widget, widgetId, res) {
        widgetModel
            .updateWidget(widgetId, widget)
            .then(
                function () {
                    res.json(true);
                },
                function (error) {
                    res.send(error);
                }
            );
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        widgetModel
            .findWidgetById(widgetId)
            .then(
                function (widget) {
                    res.json(widget);
                },
                function (error) {
                    res.send(error);
                }
            );
    }

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        if (widget) {
            widgetModel
                .createWidget(pageId, widget)
                .then(function (newWidget) {
                        pageModel
                            .populateWidget(pageId, newWidget)
                            .then(
                                function () {
                                    res.json(newWidget);
                                },
                                function (error) {
                                    res.send(error);
                                }
                            );
                    },
                    function (error) {
                        res.json(error);
                    });
        }
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(
                function (widgets) {
                    res.json(widgets);
                },
                function (error) {
                    res.send(error);
                }
            );
    }
};