module.exports = function (app) {
    var websites = [
        { "_id": "123", "name": "Facebook",    "developerId": "456" },
        { "_id": "234", "name": "Tweeter",     "developerId": "456" },
        { "_id": "456", "name": "Gizmodo",     "developerId": "456" },
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123" },
        { "_id": "678", "name": "Checkers",    "developerId": "123" },
        { "_id": "789", "name": "Chess",       "developerId": "234" }
    ];
    
    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        for (var i in websites) {
            if (websites[i]._id === websiteId) {
                websites.splice(i, 1);
                res.json(true);
                return;
            }
        }
        res.json(false);
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;
        for (var i in websites) {
            if (websites[i]._id === websiteId) {
                websites[i].name = website.name;
                websites[i].description = website.description;
                res.json(websites[i]);
                return;
            }
        }
        res.json({});
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;
        for (var i in websites) {
            if (websites[i]._id === websiteId) {
                res.json(websites[i]);
                return;
            }
        }
        res.json({});
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        var result = [];
        for (var i in websites) {
            if (websites[i].developerId === userId) {
                result.push(websites[i]);
            }
        }
        if (result.length > 0){
            res.json(result);
        } else {
            return res.json({});
        }
    }

    function createWebsite(req, res) {
        var website = req.body;
        if (website) {
            for (var i in websites) {
                if (websites[i].name === website.name) {
                    res.send({});
                    return;
                }
            }
            website._id = (new Date()).getTime()+"";
            websites.push(website);
            res.send(website);
        } else {
            res.send({});
            return;
        }
    }
};