/* require the modules needed */
var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var request = require('request');
var qs = require('querystring');
var _ = require('lodash');

module.exports = function (app, models) {

    var userModel = models.userModel;
    var restaurantModel = models.restaurantModel;

    app.post("/api/restaurant/:categoryId", getRestaurantByCategoryId);
    app.get("/api/restaurant/:restaurantId", getRestaurantByYelprestaurantId);
    app.get("/api/alluserfavorthisrestaurant/:restaurantId", findAllUsersThatFavoredThisRestaurant);
    app.get("/api/googleMapKey", getGoogleMapKey);
    app.post("/api/user/:userId/restaurant/:restaurantId", addRestaurantToFavorite);
    app.post("/api/user/:userId/restaurantcreate/:restaurantId", createRestaurantToFavorite);
    app.put("/api/user/:userId/restaurant/:restaurantId", removeRestaurantFromFavorite);
    app.get("/api/restaurantidindb/:restaurantId", findRestaurantByYelpRestaurantIdInDB);
    
    function findRestaurantByYelpRestaurantIdInDB(req, res) {
        var restaurantId = req.params.restaurantId;
        restaurantModel
            .findRestaurantByYelpRestaurantIdInDB(restaurantId)
            .then(
                function (restaurant) {
                    res.json(restaurant);
                },
                function (err) {
                    res.send(err);
                }
            )
    }

    function addRestaurantToFavorite(req, res) {
        var restaurantId = req.params.restaurantId;
        var userId = req.params.userId;
        restaurantModel
            .addUserIdToRestaurantUsers(restaurantId, userId)
            .then(
                function (restaurant) {
                    res.json(restaurant);
                },
                function (err) {
                    res.send(err);
                }
            )
    }
    
    function createRestaurantToFavorite(req, res) {
        var restaurantId = req.params.restaurantId;
        var userId = req.params.userId;
        restaurantModel
            .createRestaurantToFavorite(restaurantId, userId)
            .then(
                function (restaurant) {
                    res.json(restaurant);
                },
                function (err) {
                    res.send(err);
                }
            )
    }
    
    function removeRestaurantFromFavorite(req, res) {
        var restaurantId = req.params.restaurantId;
        var userId = req.params.userId;
        restaurantModel
            .removeUserIdFromRestaurantUsers(restaurantId, userId)
            .then(
                function (restaurant) {
                    res.json(restaurant);
                },
                function (err) {
                    res.send(err);
                }
            )
    }
    
    function findAllUsersThatFavoredThisRestaurant(req, res) {
        var restaurantId = req.params.restaurantId;
        restaurantModel
            .findAllUsersThatFavoredThisRestaurant(restaurantId)
            .then(
                function (users) {
                    res.json(users);
                },
                function (err) {
                    res.send(err);
                }
            )
    }

    function getGoogleMapKey(req, res) {
        var key = process.env.GOOGLE_MAP_KEY;
        return res.send(key);
    }

    function getRestaurantByYelprestaurantId(req, res) {
        var restaurantId = req.params.restaurantId;
        var params = restaurantId;

        request_yelp_business(params,
            function(err, response, body){
                if(err){
                    res.status(400).send(err);
                }
                if(body){
                    res.send(body);
                }
            });
    }

    function getRestaurantByCategoryId(req, res) {
        var id = req.params.categoryId;
        var locationInfo = req.body;

        var category_filter = "";
        switch (id) {
            case "0":
                category_filter = "breakfast_brunch";
                break;
            case "1":
                category_filter = "seafood";
                break;
            case "2":
                category_filter = "salad";
                break;
            case "3":
                category_filter = "sushi";
                break;
            case "4":
                category_filter = "burgers";
                break;
            case "5":
                category_filter = "pizza";
                break;
            case "6":
                category_filter = "soup";
                break;
            case "7":
                category_filter = "icecream";
                break;
            case "8":
                category_filter = "coffee";
                break;
            default:
                category_filter = "All";
        }

        var params = {
            location: locationInfo.zip,
            category_filter: category_filter
        };

        request_yelp_search(params,
            function(err, response, body){
                if(err){
                    res.status(400).send(err);

                }
                if(body){
                    res.send(body);
                }
            });
    }

    /* Function for yelp call
     * ------------------------
     * set_parameters: object with params to search
     * callback: callback(error, response, body)
     */
    var request_yelp_search = function(set_parameters, callback) {

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
    
    var request_yelp_business = function (set_parameters, callback) {
        /* The type of request */
        var httpMethod = 'GET';

        /* The url we are using for the request */
        var url = 'http://api.yelp.com/v2/business/' + set_parameters;

        /* We set the require parameters here */
        var required_parameters = {
            oauth_consumer_key : process.env.YELP_CONSUMER_KEY,
            oauth_token : process.env.YELP_TOKEN,
            oauth_nonce : n(),
            oauth_timestamp : n().toString().substr(0,10),
            oauth_signature_method : 'HMAC-SHA1',
            oauth_version : '1.0'
        };

        /* We set our secrets here */
        var consumerSecret = process.env.YELP_CONSUMER_SECRET;
        var tokenSecret = process.env.YELP_TOKEN_SECRET;

        /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
        /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
        // var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});
        var signature = oauthSignature.generate(httpMethod, url, required_parameters, consumerSecret, tokenSecret, { encodeSignature: false});

        /* We add the signature to the list of paramters */
        required_parameters.oauth_signature = signature;

        /* Then we turn the paramters object, to a query string */
        var paramURL = qs.stringify(required_parameters);

        /* Add the query string to the url */
        var apiURL = url+'?'+paramURL;

        /* Then we use request to send make the API Request */
        request(apiURL, function(error, response, body){
            return callback(error, response, body);
        });
    }
};