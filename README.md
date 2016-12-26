# Set environment variables on OpenShift
OpenShift provides simple yet powerful cloud application hosting platform. When an account is created in OpenShift three free gears are provided. A gear can be a server, a database, or some development tool. Three gears will be used in OpenShift. One for a Node.js server, one for a MongoDB instance, and one for Rockmongo, a MongoDB database client. Additional gears are not free. OpenShift allows creating and hosting all sorts of other applications using other frameworks. We will be using Node.js and MongoDB for development and Rockmongo for debugging.

Since I am using *oh my zsh* on my machine, the default shell is zsh shell instead of bash. So, to set environment variables locally, I do it in ```~/.zshrc```. If it's a bash shell, do it in ```~/.bash_profile```
Fill in the **keys** for yourself, for example this is on my local ```.zshrc```:
```
export SESSION_SECRET="yoursessionsecret"
export TWITTER_SECRET=""
export FACEBOOK_CLIENT_ID=""
export FACEBOOK_CLIENT_SECRET=""
export FACEBOOK_CALLBACK_URL="http://127.0.0.1:3000/auth/facebook/callback"
export GOOGLE_CLIENT_ID=""
export GOOGLE_CLIENT_SECRET=""
export GOOGLE_CALLBACK_URL="http://127.0.0.1:3000/auth/google/callback"
export YELP_CONSUMER_KEY=""
export YELP_CONSUMER_SECRET="yelpkey"
export YELP_TOKEN=""
export YELP_TOKEN_SECRET=""
export GOOGLE_MAP_KEY=""
```

Set an environment variable on *openshift*, for example, if *webdev* is the app name:
```rhc env set GOOGLE_CALLBACK_URL="http://webdev-kz4.rhcloud.com//auth/google/callback" -a webdev```
another example:
```rhc env set YELP_CONSUMER_KEY="yelpkey" -a webdev```
Unset an enviornment variable like:
```rhc env unset GOOGLE_CALLBACK_URL -a webdev```
List all environment variables for an app as:
```rhc env list -a webdev```
After setting the environment variables, restart *openshift* by
```rhc restart-app --app webdev```
Debug *openshift* with the log:
```rhc tail -a webdev```

Make sure the redirect URIs are set up on [*Facebook*](developers.facebook.com) and [*Google*](https://console.developers.google.com/apis/library) as well!

# Development Environment setup
1. Install Node.js, MongoDB and WebStorm
2. Open a Terminal window, ```sudo mongod``` to start up the mongo daemon
3. If the project is freshly cloned from GitHub, then do a ```npm install```. (Note that npm and node have to be installed if it has not been already)
4. Now launch *WebStorm*, if there is no configuration set up, then set it up like this:
    * Create a run configuration so you can run and debug NodeJS applications from within WebStorm.
    * Select from the menu Run, Edit Configurations...
    * In the Run/Debug Configurations window click on the plus button on the top left
    * Select Node.js
    * Name the configuration web-dev
    * Verify the Node interpreter field has the directory of where Node.js is installed
    * Verify the Working directory field has the directory of your project
    * In the JavaScript file field type server.js, the file you edited previously
after the configuration is setup, click **Run** or **Debug**. Or you can just start a Terminal window and ```node server.js```
5. To setup environment variable, locally,  see "Set environment variables on OpenShift" Email.
6. Open browser and direct to: http://localhost:3000/

# Commit to GitHub and OpenShift
1. ```git add . ```
2. ```git commit -m "message"```
3. ```git push github```
4. ```git push github``` and ```git push openshift``` (github and openshift are previously set up remote repositories, ```git remote -v``` to see your references)

# MongoDB Short Introduction
After opening ```sudo mongod``` to start up the mongo daemon,  open another Terminal window, ```mongo``` to connect to the mongo database.
1. ```show dbs``` to display all the databases. In my case, the database is called ```cs5610summer1```
2. ```use cs5610summer1``` to switch to this database. ```show collections``` to display all collections. In my case, I have *assignment.page*, *assignment.user*, *assignment.website*, *assignment.widget*, *project.comment*, *project.reply*, *project.restaurant*, *project.user*
3. To display *project.user*: ```db.project.user.find()``` or ```db.project.user.find().pretty()```
4. To display a user, say "y", ```db.project.user.find({username: "y"})```
5. To delete a collection: ```db.project.user.drop()```