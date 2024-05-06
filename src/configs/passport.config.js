const passport = require('passport');
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook');
const UserService = require('../services/userService');
const userService = new UserService();

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${process.env.URL_BE}/users/facebook/redirect`,
  }, 
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userService.findOrCreateOauthUser(profile);
      console.log(user);
      done(null, user);
    }
    catch (error) {
      done(error);
    }
  }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.URL_BE}/users/google/redirect`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userService.findOrCreateOauthUser(profile);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
));

passport.serializeUser(async (user, done) => {
  try {
    // Assume `user` is a Mongoose model that needs to be updated/saved
    done(null, user); // Continue without errors
  } catch (error) {
    done(error); // Handle errors
  }
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;