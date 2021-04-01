// importing required packages


const express = require(‘express’);

const passport = require(‘passport’);

const path = require(‘path’);

const GoogleStrategy = require(‘passport-google-oauth20’).Strategy;


const app = express();


// defining parameters


// client id is the parameter that we will get from the google developer console

CLIENT_ID=”xxxxxxx”;


// client secret will also be taken from the google developer console

CLIENT_SECRET=”xxxxx”;


// user will be redirected to the CALLBACK_URL after authorization

CALLBACK_URL=”http://localhost:8000/authorized”;


// port number must be the same as defined in the developer console

PORT=8000;


// configuring passport middleware


app.use(passport.initialize());

app.use(passport.session());


passport.serializeUser( function(id, done) {

  done(null, id);

});


passport.deserializeUser( function(id, done) {

  done(null, id);

});


// following middleware will run whenever passport. Authenticate method is called and returns different parameters defined in the scope.


passport.use(new GoogleStrategy({

  clientID: CLIENT_ID,

  clientSecret: CLIENT_SECRET,

  callbackURL: CALLBACK_URL

  },

  async function(accessToken, refreshToken, profile, email, cb) {

    return cb(null, email.id);

  }

));




// serving home page for the application

app.get(‘/’, (req, res) =>

{

  res.sendFile(path.join(__dirname + ‘/public/index.html’));

});


// serving success page for the application

app.get(‘/success’, (req, res) =>

{

  res.sendFile(path.join(__dirname + ‘/public/success.html’));

});


// user will be redirected to the google auth page whenever hits the ‘/google/auth’ route.


app.get(‘/google/auth’,

  passport.authenticate(‘google’, {scope: [‘profile’, ‘email’]})

);


// authentication failure redirection is defined in the following route


app.get(‘/authorized’,

  passport.authenticate(‘google’, {failureRedirect: ‘/’}),

  (req, res) =>

  {

    res.redirect(‘/success’);

  }

);


// running server


app.listen(PORT, () =>

{

  console.log(“Server is running on Port ” + PORT)

})