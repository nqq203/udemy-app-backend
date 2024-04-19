const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserService = require('../services/userService');
const userService = new UserService();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/users/google/redirect"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userService.findOrCreateGoogleUser(profile);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
));

passport.serializeUser(async (user, done) => {
  try {
    // Assume `user` is a Mongoose model that needs to be updated/saved
    await user.save(); // Updated to use async/await
    done(null, user._id); // Continue without errors
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