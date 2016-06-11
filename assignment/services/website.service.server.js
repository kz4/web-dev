module.exports = function (app, models) {

    var userModel = models.userModel;
    var websiteModel = models.websiteModel;

    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;

        websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                var userId = website._user;
                websiteModel
                    .deleteWebsite(websiteId)
                    .then(
                        function () {
                            userModel
                                .spliceWebsite(userId, websiteId)
                                .then(function () {
                                    res.sendStatus(200);
                                });
                        },
                        function (error) {
                            res.send(error);
                        }
                    );
            });

    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;
        websiteModel
            .updateWebsite(websiteId, website)
            .then(
                function () {
                    // res.sendStatus(200);
                    res.json(website);
                },
                function (error) {
                    res.send(error);
                }
            );
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;
        websiteModel
            .findWebsiteById(websiteId)
            .then(
                function (website) {
                    res.json(website);
                },
                function (error) {
                    res.send(error);
                }
            );
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        websiteModel
            .findAllWebsitesForUser(userId)
            .then(
                function (websites) {
                    res.json(websites);
                },
                function (error) {
                    res.send(error);
                }
            );
    }

    function createWebsite(req, res) {
        var userId = req.params.userId;
        var website = req.body;
        if (website.name) {
            websiteModel
                .createWebsiteForUser(userId, website)
                .then(
                    function (website) {
                        userModel
                            .populateWebsite(userId, website)
                            .then(
                                function () {
                                    res.json(website);
                                }
                            );
                    },
                    function (error) {
                        res.send(error);
                    }
                )
        } else {
            res.send("Website name empty");
        }
    }
};