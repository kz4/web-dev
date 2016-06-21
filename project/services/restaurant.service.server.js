/* require the modules needed */
var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var request = require('request');
var qs = require('querystring');
var _ = require('lodash');

module.exports = function (app, models) {

    var userModel = models.userModel;
    // var restaurantModel = models.restaurantModel;


    app.post("/api/restaurant/:categoryId", getRestaurantByCategoryId);

    function getRestaurantByCategoryId(req, res) {
        var id = req.params.categoryId;
        var locationInfo = req.body;
        
        console.log(id);
        console.log(locationInfo.zip);

        var category_filter = "";
        switch (id) {
            case "0":
                category_filter = "breakfast_brunch";
                break;
        
            default:
                category_filter = "All";
        }

        var params = {
            location: locationInfo.zip,
            category_filter: category_filter
        };

        // var params = {category_filter: category_filter};
        // params.location = locationInfo.zip;

        // request_yelp(params, callback)
        request_yelp(params,
            function(err, response, body){
                if(err){
                    res.status(400).send(err);

                }
                if(body){
                    res.send(body);
                    console.log(body);
                }
            })
    }


    /* Function for yelp call
     * ------------------------
     * set_parameters: object with params to search
     * callback: callback(error, response, body)
     */
    var request_yelp = function(set_parameters, callback) {

        /* The type of request */
        var httpMethod = 'GET';

        /* The url we are using for the request */
        var url = 'http://api.yelp.com/v2/search';

        /* We can setup default parameters here */
        var default_parameters = {
            sort: '2'
        };

        /* We set the require parameters here */
        var required_parameters = {
            oauth_consumer_key : process.env.YELP_CONSUMER_KEY,
            oauth_token : process.env.YELP_TOKEN,
            oauth_nonce : n(),
            oauth_timestamp : n().toString().substr(0,10),
            oauth_signature_method : 'HMAC-SHA1',
            oauth_version : '1.0'
        };

        /* We combine all the parameters in order of importance */
        var parameters = _.assign(default_parameters, set_parameters, required_parameters);

        /* We set our secrets here */
        var consumerSecret = process.env.YELP_CONSUMER_SECRET;
        var tokenSecret = process.env.YELP_TOKEN_SECRET;

        /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
        /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
        var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

        /* We add the signature to the list of paramters */
        parameters.oauth_signature = signature;

        /* Then we turn the paramters object, to a query string */
        var paramURL = qs.stringify(parameters);

        /* Add the query string to the url */
        var apiURL = url+'?'+paramURL;

        /* Then we use request to send make the API Request */
        request(apiURL, function(error, response, body){
            return callback(error, response, body);
        });

    };

    function loggedIn(req, res) {
        if (req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function googleLogin(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function (googleUser) {
                    if (googleUser) {
                        return done(null, googleUser);
                    } else {
                        googleUser = {
                            username: profile.displayName.replace(/ /g, ''),
                            email: profile.emails[0].value,
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            google: {
                                token: token,
                                id: profile.id,
                                displayname: profile.displayName
                            }
                        };
                        userModel
                            .createUser(googleUser)
                            .then(
                                function (user) {
                                    done(null, user);
                                },
                                function (error) {

                                }
                            )
                    }
                }
            )
    }

    function projectSerializeUser(user, done) {
        done(null, user);
    }

    function projectDeserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function deleteUser(req, res) {
        // var id = req.params.userId;
        // userModel
        //     .deleteUser(id)
        //     .then(
        //         function () {
        //             websiteModel
        //                 .findAllWebsitesForUser(id)
        //                 .then(function (websites) {
        //                     for (var i in websites) {
        //                         pageModel
        //                             .findAllPagesForWebsite(websites[i]._id)
        //                             .then(function (pages) {
        //                                     for (var j in pages) {
        //                                         widgetModel
        //                                             .findAllWidgetsForPage(pages[j]._id)
        //                                             .then(function (widgets) {
        //                                                 for (var k in widgets) {
        //                                                     widgetModel
        //                                                         .deleteWidget(widgets[k]._id)
        //                                                         .then(function () {
        //                                                                 res.sendStatus(200);
        //                                                             }, function (error) {
        //                                                                 res.send(error);
        //                                                             });
        //                                                 }
        //                                             }, function (error) {
        //                                                 res.send(error);
        //                                             });
        //                                         pageModel
        //                                             .deletePage(pages[j]._id)
        //                                             .then(function () {
        //                                                     res.sendStatus(200);
        //                                                 },
        //                                                 function (error) {
        //                                                     res.send(error);
        //                                                 });
        //                                     }
        //                                 },
        //                                 function (error) {
        //                                     res.send(error);
        //                                 });
        //                         websiteModel
        //                             .deleteWebsite(websites[i]._id)
        //                             .then(function () {
        //                                 res.sendStatus(200);
        //                             }, function (error) {
        //                                 res.send(error);
        //                             });
        //                     }
        //                 }, function (error) {
        //                     res.send(error);
        //                 });
        //         },
        //         function (error) {
        //             // res.statusCode(404).send(error);
        //             res.send(error);
        //         }
        //     );

        var id = req.params.userId;
        userModel
            .deleteUser(id)
            .then(
                function () {
                    res.send(200);
                }, function () {
                    res.status(400).send("Error deleting a user");
                }
            )
    }

    function updateUser(req, res) {
        var id = req.params.userId;
        var newUser = req.body;
        userModel
            .updateUser(id, newUser)
            .then(
                function () {
                    res.sendStatus(200);
                },
                function (error) {
                    // res.statusCode(404).send(error);
                    res.send(error);
                }
            );
    }

    function createUser(req, res) {
        var user = req.body;
        if (user.username) {
            userModel
            // check if username exists
                .findUserByUsername(user.username)
                .then(function (userExists) {
                    // if user cannot be found
                    if (!userExists) {
                        return userModel
                            .createUser(user)
                            .then(
                                function (user) {
                                    res.json(user);
                                },
                                function (error) {
                                    // res.statusCode(404).send(error);
                                    res.send(error);
                                }
                            )
                    } else {
                        // Username already exists
                        // res.status(400).send("Username already exists");
                        res.send("Username already exists");
                    }
                });
        }
    }

    function getUsers(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        if (username && password) {
            findUserByCredentials(username, password, req, res);
        } else if (username) {
            findUserByUsername(username, res);
        } else {
            res.send(users);
        }
    }

    function findUserById(req, res) {
        var id = req.params.userId;
        userModel
            .findUserById(id)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    // res.statusCode(404).send(error);
                    res.send(error);
                }
            );
    }

    // function findUserByCredentials(username, password, req, res) {
    //     userModel
    //         .findUserByCredentials(username, password)
    //         .then(
    //             function (user) {
    //                 res.json(user);
    //             },
    //             function (error) {
    //                 // res.statusCode(404).send(error);
    //                 res.send(error);
    //             }
    //         );
    // }

    function findUserByUsername(username, res) {
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    // res.statusCode(404).send(error);
                    res.send(error);
                }
            );
    }
};