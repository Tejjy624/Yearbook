// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

//================================================================================================================
"use strict";


//Gets our databse up and running
const sql = require("sqlite3").verbose();
const profileDB = new sql.Database("profiles.db");

app.use(express.urlencoded({ extended: true })); //allows parsing of the image upload

app.use(express.json()); //allows parsing of the json object

app.use(express.static("./public")); //allows us to serve static content

app.use("/images", express.static("images")); //stores images

const fs = require("fs");
const FormData = require("form-data");

/*==========================All Database Code Here==============================*/

//Creates profiles.db if it hasn't been created yet or is empty
let cmd =
  "SELECT name FROM sqlite_master WHERE type='table' AND name='MyProfileTable' ";
  profileDB.get(cmd, function(err, val) {
  console.log(err, val);
  if (val == undefined) {
    console.log("No Database, creating now");
    createProfileDB();
  } else {
    console.log("Database already made");
  }
});

//the funciton that actually creates the database
function createProfileDB() {
  const cmd =
    "CREATE TABLE MyProfileTable (email TEXT, name TEXT, major TEXT, quote TEXT, gender TEXT, college TEXT, image TEXT, bio TEXT)";
  profileDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Well that didn't work: ", err.message);
    } else {
      console.log("It worked!");
    }
  });
}

//Image handler
const multer = require("multer");

//Where our images will be stored
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/images");
  },
  //keep original filename
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

//make an object that knows how to parse our images
let uploadMulter = multer({ storage: storage });

/*==========================================================IMAGE API=============================================*/

// handles post request to upload image to profile
app.post('/uploadProfileImage', uploadMulter.single('newImage'), function (request, response) {
  console.log("Recieved",request.file.originalname,request.file.size,"bytes")
  // the file object "request.file" is truthy if the file exists
  if(request.file) {
    sendMediaStore('/images/' + request.file.originalname, request, response);
    fs.unlink('images/' + request.file.originalname, (err) => {
      if (err) throw err;
      console.log(request.file.originalname + ' was deleted');
    });
  }
  else throw 'error';
})

// handles the upload to the media storage API
function sendMediaStore(filename, serverRequest, serverResponse) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    serverResponse.status(400);
    serverResponse.send("No API key provided");
  } else {
    // we'll send the image from the server in a FormData object
    let form = new FormData();
    
    // we can stick other stuff in there too, like the apiKey
    form.append("apiKey", apiKey);
    // stick the image into the formdata object
    form.append("storeImage", fs.createReadStream(__dirname + filename));
    // and send it off to this URL
    form.submit("http://ecs162.org:3000/fileUploadToAPI", function(err, APIres) {
      // did we get a response from the API server at all?
      if (APIres) {
        // OK we did
        console.log("API response status", APIres.statusCode);
        // the body arrives in chunks - how gruesome!
        // this is the kind stream handling that the body-parser 
        // module handles for us in Express.  
        let body = "";
        APIres.on("data", chunk => {
          body += chunk;
        });
        APIres.on("end", () => {
          // now we have the whole body
          if (APIres.statusCode != 200) {
            serverResponse.status(400); // bad request
            serverResponse.send(" Media server says: " + body);
          } else {
            serverResponse.status(200);
            serverResponse.send(body);
          }
        });
      } else { // didn't get APIres at all
        serverResponse.status(500); // internal server error
        serverResponse.send("Media server seems to be down.");
      }
    });
  }
}

// handles POST request to update profile page
app.post('/updateProfilePage', express.json(), function (req, res) {
  let searchCMD = "SELECT * FROM MyProfileTable WHERE email = ?";
  profileDB.get(searchCMD, req.body.email, (err, val) => {
    if (err) {
      console.log("error selecting into MyProfileTable");
      console.log(err.message);
    }
    else {
      if (val) {
        let updateCMD = "UPDATE MyProfileTable SET name = ?, major = ?, quote = ?, gender = ?, college = ?, image = ?, bio = ? WHERE email = ?";
        profileDB.run(updateCMD, req.body.name, req.body.major, req.body.quote, req.body.gender, req.body.college, req.body.image, req.body.bio, req.body.email, (err) => {
          if (err) {
            console.log("error updating the MyProfileTable");
            console.log(err.message);
          }
          else {
            console.log("successfully updated MyProfileTable");
            // send back message
            res.send('successfully updated profile page in database');
          }
        })
      }
      else {
          // insert command
        let insertCMD = "INSERT INTO MyProfileTable (email, name, major, quote, gender, college, image, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        // run command
        profileDB.run(insertCMD, req.body.email, req.body.name, req.body.major, req.body.quote, req.body.gender, req.body.college, req.body.image, req.body.bio, (err) => {
          if (err) {
            console.log("error inserting into MyProfileTable");
            console.log(err.message);
          }
          else {
            console.log("successfully inserted into MyProfileTable");
            // send back message
            res.send('successfully inserted profile page into database');
          }
        });
      }
     }
  })
  
  
});

// handles get request to display user profile
// handle recipient AJAX request
app.get('/displayProfilePage', function(req, res){
  let user = req.query.user;
  let cmd = "SELECT * FROM MyProfileTable WHERE email = ?";
  profileDB.get(cmd, user, function(err, val) {
    if (val) {
      res.send(val);
    } else {
      res.send('new user');
    }
  })
});

app.get('/result', function(req, res){
  let search_term = req.query.search;
  let param = req.query.param;
  
  let cmd = "SELECT * FROM MyProfileTable WHERE ? = ?";
  profileDB.get(cmd, param, search_term, function(err, val){
    if(val) {
      //this means we got results, need to handle appropriately
      
    } else {
      //this means no results, need to direct back to /search with a query saying no results
      //idk how to set up front end to modify search page based off of no results
      //frontend needs to have a handler for this and display an error message saying
      //"No results found, search again?"
      res.redirect('/search?error=no_results');
    }
  })
})


//=============================================================================LOGIN HANDLER============================================================
// We need many modules

const bodyParser = require('body-parser');
const assets = require('./assets');

// and some new ones related to doing the login process
const passport = require('passport');
// There are other strategies, including Facebook and Spotify
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Some modules related to cookies, which indicate that the user
// is logged in
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

// Setup passport, passing it information about what we want to do
passport.use(new GoogleStrategy(
  // object containing data to be sent to Google to kick off the login process
  // the process.env values come from the key.env file of your app
  // They won't be found unless you have put in a client ID and secret for 
  // the project you set up at Google
  {
  clientID: process.env.ClientID,
  clientSecret: process.env.ClientSecret,
  // CHANGE THE FOLLOWING LINE TO USE THE NAME OF YOUR APP
  callbackURL: 'https://profuse-positive-silicon.glitch.me/auth/accepted',
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo', // where to go for info
  scope: ['profile email'] // the information we will ask for from Google
},
  // function to call to once login is accomplished, to get info about user from Google;
  // it is defined down below.
  gotProfile));


// Start setting up the Server pipeline
console.log("setting up pipeline")

// take HTTP message body and put it as a string into req.body
app.use(bodyParser.urlencoded({extended: true}));

// puts cookies into req.cookies
app.use(cookieParser());

// pipeline stage that echos the url and shows the cookies, for debugging.
app.use("/", printIncomingRequest);

// Now some stages that decrypt and use cookies

// express handles decryption of cooikes, storage of data about the session, 
// and deletes cookies when they expire
app.use(expressSession(
  { 
    secret:'bananaBread',  // a random string used for encryption of cookies
    maxAge: 6 * 60 * 60 * 1000, // Cookie time out - six hours in milliseconds
    // setting these to default values to prevent warning messages
    resave: true,
    saveUninitialized: false,
    // make a named session cookie; makes one called "connect.sid" as well
    name: "ecs162-session-cookie"
  }));

// Initializes request object for further handling by passport
app.use(passport.initialize()); 

// If there is a valid cookie, will call passport.deserializeUser()
// which is defined below.  We can use this to get user data out of
// a user database table, if we make one.
// Does nothing if there is no cookie
app.use(passport.session()); 


// The usual pipeline stages

// Public files are still serverd as usual out of /public <---------------------------------------------------This accomplishes the same thing as Eli's code you copied above
app.get('/*',express.static('public'));

// special case for base URL, goes to index.html   <----------------------------------------------------------This is a get request for the homepage. It is redirected to from elsewhere in the login so please don't delete
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


// So this is the redirect if they logged in with a wrong email.
//On the front end for the login page, the script needs to check window.location.search on loading and if
//the query term 'email' is present and equal to 'notUCD', the error message needs to pop up and tell them to use a UCD email
app.get('/query', function(req, res){ //   <-----------------------------------------------------Read comments here
  res.sendFile(__dirname + '/public/index.html');
})

// Glitch assests directory 
app.use("/assets", assets);

// stage to serve files from /user, only works if user in logged in

// If user data is populated (by deserializeUser) and the
// session cookie is present, get files out 
// of /user using a static server. 
// Otherwise, user is redirected to public splash page (/index) by
// requireLogin (defined below)
app.get('/profile*', requireUser, requireLogin, express.static('.')); //<--------------------------------------------------------------------------------------- Read comments below
// So the way it works right now is that any content that is protected by logging in is kept in the /user directory. I've created one here.
// ANY pages that require someone to be logged in (so for us just profile creation/modification) need to be kept in this directory




// Now the pipeline stages that handle the login process itself

// Handler for url that starts off login with Google.
// The app (in public/index.html) links to here (note not an AJAX request!)
// Kicks off login process by telling Browser to redirect to Google.
app.get('/auth/google', passport.authenticate('google'));
// The first time its called, passport.authenticate sends 302 
// response (redirect) to the Browser
// with fancy redirect URL that Browser will send to Google,
// containing request for profile, and
// using this app's client ID string to identify the app trying to log in.
// The Browser passes this on to Google, which brings up the login screen. 


// Google redirects here after user successfully logs in. 
// This second call to "passport.authenticate" will issue Server's own HTTPS 
// request to Google to access the user's profile information with the  	
// temporary key we got from Google.
// After that, it calls gotProfile, so we can, for instance, store the profile in 
// a user database table. 
// Then it will call passport.serializeUser, also defined below.
// Then it either sends a response to Google redirecting to the 
// /setcookie endpoint, below
// or, if failure, it goes back to the public splash page. 
// NOTE:  Apparently, this ends up at the failureRedirect if we
// do the revoke in gotProfile.  So, if you want to redirect somewhere
// else for a non-UCDavis ID, do it there. 
app.get('/auth/accepted', 
  passport.authenticate('google', 
    { successRedirect: '/setcookie', failureRedirect: '/' }
  )
);

// One more time! a cookie is set before redirecting
// to the protected homepage
// this route uses two middleware functions.
// requireUser is defined below; it makes sure req.user is defined
// the second one makes a public cookie called
// google-passport-example
app.get('/setcookie', requireUser, 
  function(req, res) {
    // if(req.get('Referrer') && req.get('Referrer').indexOf("google.com")!=-1){
      // mark the birth of this cookie
  
      // set a public cookie; the session cookie was already set by Passport
      res.cookie('google-passport-example', new Date());
  
      let user = req.user.userData.split('@')[0]
      res.redirect('/profile?user=' + user); // <-------------------------------------------------------------- This is the first page it will redirect to once logged in. Needs to be profile creation page and needs to be in user directory
    //} else {
    //   res.redirect('/');
    //}
  }
);


// currently not used
// using this route, we can clear the cookie and close the session
app.get('/user/logoff',
  function(req, res) {
    // clear both the public and the named session cookie
    res.clearCookie('google-passport-example');
    res.clearCookie('ecs162-session-cookie');
    res.redirect('/');
  }
);


// Some functions called by the handlers in the pipeline above


// Function for debugging. Just prints the incoming URL, and calls next.
// Never sends response back. 
function printIncomingRequest (req, res, next) {
    console.log("Serving",req.url);
    if (req.cookies) {
      console.log("cookies",req.cookies)
    }
    next();
}

// function that handles response from Google containing the profiles information. 
// It is called by Passport after the second time passport.authenticate
// is called (in /auth/accepted/)
function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile",profile); //<-------------------------------------------------------profile.emails will be email address
    console.log("Google email domain", profile._json.hd); 

    // here is a good place to check if user is in DB,
    // and to store them in DB if not already there. 
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.

    let UNIQUE_ID = profile._json.email;  // temporary! Should be the real unique
    // key for db Row for this user in DB table.
    // Note: cannot be zero, has to be something that evaluates to
    // True.  
    if (profile._json.hd != 'ucdavis.edu') {
      UNIQUE_ID = 3;
    }

    console.log("The UNIQUE ID IS ", UNIQUE_ID);
    done(null, UNIQUE_ID);
}


// Part of Server's sesssion set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
// For instance, if there was some specific profile information, or
// some user history with this Website we pull out of the user table
// using dbRowID.  But for now we'll just pass out the dbRowID itself.
passport.serializeUser((UNIQUE_ID, done) => {
    console.log("SerializeUser. Input is",UNIQUE_ID);
    done(null, UNIQUE_ID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie (so, while user is logged in)
// This time, 
// whatever we pass in the "done" callback goes into the req.user property
// and can be grabbed from there by other middleware functions
passport.deserializeUser((UNIQUE_ID, done) => {
    console.log("deserializeUser. Input is:", UNIQUE_ID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    let userData = {userData: UNIQUE_ID};
    done(null, userData);
});


function requireUser (req, res, next) {
  console.log("require user",req.user)
  if (!req.user) {
    res.redirect('/');
  } else if(req.user.userData == 3) {
    res.redirect('/query?email=notUCD');  //<------------------------------------------------------------------------------------------- This is the redirect to the route for an incorrect email. 
  }else {
    console.log("user is",req.user);
    next();
  }
};

function requireLogin (req, res, next) {
  console.log("checking:",req.cookies);
  if (!req.cookies['ecs162-session-cookie']) {
    res.redirect('/');
  } else {
    next();
  }
};


// from eli gonzalez @1461 for routing
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})


//==================================================================================================================

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
