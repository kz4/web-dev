module.exports = function (app, models) {
    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    var userModel = models.userModel;

    app.post ("/api/profileImageUpload", upload.single('myFile'), uploadImage);

    function uploadImage(req, res) {
        var userId = req.body.userId;
        // var width = req.body.width;
        var imageUrl = req.body.imageUrl;

        var filename = "";

        var isUploaded = false;
        if (imageUrl) {
            filename = imageUrl;
        } else {
            isUploaded = true;
            var myFile        = req.file;

            if(myFile == null) {
                res.redirect("/project/#/user/" + userId);
                return;
            }

            var originalname  = myFile.originalname; // file name on user's computer
            filename      = myFile.filename;     // new file name in upload folder
            var path          = myFile.path;         // full path of uploaded file
            var destination   = myFile.destination;  // folder where file is saved to
            var size          = myFile.size;
            var mimetype      = myFile.mimetype;
        }


        userModel
            .findUserById(userId)
            .then(
                function (user) {
                    if (isUploaded) {
                        user.profilePic = "/uploads/" + filename;
                    } else {
                        user.profilePic = filename;
                    }

                    userModel
                        .updateUser(userId, user)
                        .then(
                            function () {
                                res.redirect("/project/#/user/" + userId);
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

};