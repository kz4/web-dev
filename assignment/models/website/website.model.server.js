module.exports  = function () {

    var mongoose = require('mongoose');
    var WebsiteSchema = require("./website.schema.server")();
    var Website = mongoose.model("Website", WebsiteSchema);

    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite
    };
    return api;
    
    function deleteWebsite(websiteId) {
        return Website.remove({_id: websiteId});
    }
    
    function updateWebsite(websiteId, website) {
        return Website.update({_id: websiteId}, {
           $set: {
               name: website.name,
               description: website.description
           }
        });
    }
    
    function findWebsiteById(websiteId) {
        return Website.findById(websiteId);
    }
    
    function findAllWebsitesForUser(userId) {
        return Website.find({_user: userId});
    }
    
    function createWebsiteForUser(userId, website) {
        website._user = userId;
        return Website.create(website);
    }
};