var q = require("q");

module.exports = function () {

    var mongoose = require('mongoose');
    var UserSchema = require("./user.schema.server")();
    var ProjectUser = mongoose.model("ProjectUser", UserSchema);

    var api = {
        createUser: createUser,
        findAllUsers: findAllUsers,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        addACommentToUser: addACommentToUser,
        updateUser: updateUser,
        deleteUser: deleteUser,
        followUser: followUser,
        followByUser: followByUser,
        unfollowUser: unfollowUser,
        unfollowByUser: unfollowByUser,
        populateWebsite: populateWebsite,
        spliceWebsite: spliceWebsite,
        findUserByGoogleId: findUserByGoogleId
    };
    return api;

    function followUser(followerId, followedId) {
        var deferred = q.defer();

        // insert followedId with mongoose user model's findById
        ProjectUser.findById(followerId, function (err, follower) {
            if (!err) {
                if(follower) {
                    follower.following.push(followedId);
                    follower.save(function (err) {
                        if (!err) {
                            deferred.resolve(follower);
                        } else {
                            deferred.reject(err);
                        }
                    });
                } else {
                    deferred.resolve(follower);
                }
            } else {
                // reject promise if error
                deferred.reject(err);
            }
        });

        return deferred.promise;

    }

    function followByUser(followerId, followedId) {
        var deferred = q.defer();

        // insert followerId with mongoose user model's findById
        ProjectUser.findById(followedId, function (err, followed) {
            if (!err) {
                if(followed) {
                    followed.followedBy.push(followerId);
                    followed.save(function (err) {
                        if (!err) {
                            deferred.resolve(followed);
                        } else {
                            deferred.reject(err);
                        }
                    });
                } else {
                    deferred.resolve(followed);
                }
            } else {
                // reject promise if error
                deferred.reject(err);
            }
        });

        return deferred.promise;

    }

    function unfollowUser(followerId, followedId) {
        var deferred = q.defer();

        // remove followedId with mongoose user model's findById
        ProjectUser.update(
            { _id: followerId },
            { $pull: { following: followedId } },
            { multi: true },
            function (err, numAffected) {
                if (!err) {
                    deferred.resolve(numAffected)
                } else {
                    // reject promise if error
                    deferred.reject(err);
                }
            });

        return deferred.promise;

    }

    function unfollowByUser(followerId, followedId) {

        var deferred = q.defer();

        // remove followerId with mongoose user model's findById
        ProjectUser.update(
            { _id: followedId },
            { $pull: { followedBy: followerId } },
            { multi: true },
            function (err, numAffected) {
                if (!err) {
                    deferred.resolve(numAffected)
                } else {
                    // reject promise if error
                    deferred.reject(err);
                }
            });

        return deferred.promise;
    }

    function findUserByGoogleId(id) {
        return ProjectUser.findOne({"google.id": id});
    }

    function spliceWebsite(userId, websiteId) {
        return ProjectUser.findOne({_id: userId},
            function(err, doc) {
                doc.websites.pull(websiteId);
                doc.save();
            });
    }

    function populateWebsite(userId, website) {
        return ProjectUser.findOne({_id: userId},
            function(err, doc) {
                doc.websites.push(website);
                doc.save();
            });
    }

    function deleteUser(userId) {
        return ProjectUser.remove({_id: userId});
    }

    function updateUser(userId, user) {
        return ProjectUser.update({_id: userId}, {

            // delete user._id;     // add this line, for older version of mongodb that set the _id,
            // if you just want to do $set: user
            //    $set: user    // you can use this, but username can also be used

            // do it this way, so you can customize the field you want to update
            $set: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePic: user.profilePic
            }
        });
    }

    function addACommentToUser(userId, comment) {
        return ProjectUser.update({_id: userId}, {
            $push: {
                comments: comment
            }
        });

        // This works just as well
        // return ProjectUser.findById(userId,
        //     function (err, doc) {
        //         doc.comments.push(comment);
        //         doc.save();
        //     });
    }

    function createUser(user) {
        return ProjectUser.create(user);
    }

    function findAllUsers() {
        return ProjectUser.find();
    }

    function findUserByUsername(username) {
        return ProjectUser.findOne({username: username});
    }

    function findUserById(userId) {
        // return ProjectUser.findById(userId);
        return ProjectUser.findById(userId)
            .populate('following')
            .exec(function (error, doc) {

            });
    }

    function findUserByCredentials(username, password) {
        return ProjectUser.findOne({username: username, password: password});
    }

    function findUserByGoogleId(id) {
        return ProjectUser.findOne({"google.id": id});
    }
};