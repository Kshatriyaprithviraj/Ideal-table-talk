'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  'local.signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passreqTocallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(
            null,
            false,
            req.flash('error', 'User with the email already exists')
          );
        }
        const newUser = new User();
        newUser.local.username = req.body.username;
        newUser.local.fullname = req.body.username;
        newUser.local.email = req.body.email;
        newUser.local.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
          done(null, newUser);
        });
      });
    }
  )
);
