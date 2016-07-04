// The passport local strategy allows implementing simple username and password based authentication.
var projectPassport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var bcrypt = require("bcrypt-nodejs");
var fs = require("fs");
var path = require("path");

module.exports = function (app, models) {

    var userModel = models.userModel;

    app.post("/api/user", createUser);
    app.get("/api/users", getAllUsers);
    app.get("/api/users/population", getAllUsersWithPopulation);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId/comment", addACommentToUser);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.put("/api/user/:userId/profilePic/:profilePic", deleteUserProfilePic);
    app.post  ("/api/project/user/:followerId/user/:followedId", userFollowsUser);
    app.put   ("/api/project/user/:followerId/user/:followedId", userUnfollowsUser);
    app.post("/api/user/:userId/restaurant/:restaurantId", addRestaurantToFavorite);
    app.delete("/api/user/:userId/restaurant/:restaurantId", removeRestaurantFromFavorite);
    app.post('/api/login', projectPassport.authenticate('local'), login);
    app.get('/auth/google', projectPassport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',
        projectPassport.authenticate('google', {
            successRedirect: '/project/#/user',
            failureRedirect: '/project//#/login'
        }));

    app.post("/api/logout", logout);
    app.get("/api/loggedIn", loggedIn);
    app.post('/api/project/register', register);

    projectPassport.use('local', new LocalStrategy(localStrategy));    // 'local' is optional because it's well-known, for others it has to match the passport authenticate
    projectPassport.serializeUser(projectSerializeUser);
    projectPassport.deserializeUser(projectDeserializeUser);

    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    }

    projectPassport.use('google', new GoogleStrategy(googleConfig, googleLogin));

    function addRestaurantToFavorite(req, res) {
        var userId = req.params.userId;
        var restaurantId = req.params.restaurantId;
        userModel
            .addRestaurantToFavoriteForUser(userId, restaurantId)
            .then(
                function () {
                    res.sendStatus(200);
                },
                function (err) {
                    res.send(err);
                }
            )
    }

    function removeRestaurantFromFavorite(req, res) {
        var userId = req.params.userId;
        var restaurantId = req.params.restaurantId;
        userModel
            .removeRestaurantFromFavoriteForUser(userId, restaurantId)
            .then(
                function () {
                    res.sendStatus(200);
                },
                function (err) {
                    res.send(err);
                }
            )
    }

    function userFollowsUser(req, res) {

        var followerId = req.params.followerId;
        var followedId = req.params.followedId;

        userModel.followByUser(followerId, followedId)
            .then(
                function ( docs ) {
                    return userModel.followUser(followerId, followedId);
                },
                function ( err ) {
                    res.status(400).send(err);
                })
            .then(
                function ( user ) {
                    res.json(user);
                },
                function ( err ) {
                    res.status(400).send(err);
                });
    }

    function userUnfollowsUser(req, res) {

        var followerId = req.params.followerId;
        var followedId = req.params.followedId;


        userModel.unfollowByUser(followerId, followedId)
            .then(
                function ( docs ) {
                    return userModel.unfollowUser(followerId, followedId);
                },
                function ( err ) {
                    res.status(400).send(err);
                })
            .then(
                function ( user ) {
                    res.json(user);
                },
                function ( err ) {
                    res.status(400).send(err);
                });
    }

    function register(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        if (username && password) {
            userModel
                .findUserByUsername(username)
                .then(
                    function (user) {
                        if (user) {
                            // res.status(400).json("Username already in use");
                            res.json("Username already exists");
                            return;
                        } else {
                            req.body.password = bcrypt.hashSync(req.body.password);
                            return userModel
                                .createUser(req.body)
                        }
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                )
                .then(
                    function (user) {
                        if (user) {
                            req.login(user, function (err) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.json(user);
                                }
                            });
                        }
                    },
                    function (err) {
                        res.send(err);
                    }
                )
        } else {
            res.json("Username empty or password not matches");
        }
    }

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

    function deleteUserProfilePic(req, res) {
        var profilePicFullPath = path.resolve(__dirname + "/../../public/uploads/" + req.params.profilePic);

        fs.unlink(profilePicFullPath, function (err) {
            if (!err) {
                res.send(200);
            } else {
                res.status(400).send(err);
            }
        });
    }

    function deleteUser(req, res) {
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

    function addACommentToUser(req, res) {
        var userId = req.params.userId;
        var comment = req.body;
        userModel
            .addACommentToUser(userId, comment)
            .then(
                function (result) {
                    // res.sendStatus(200);
                    res.json(result);
                },
                function (err) {
                    res.send(err);
                }
            )
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

    function getAllUsers(req, res) {
        userModel
            .findAllUsers()
            .then(
                function (users) {
                    res.json(users);
                },
                function (error) {
                    res.send(error);
                }
            );
    }

    function getAllUsersWithPopulation(req, res) {
        userModel
            .getAllUsersWithPopulation()
            .then(
                function (users) {
                    res.json(users);
                },
                function (error) {
                    res.send(error);
                }
            );
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