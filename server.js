const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
// const validator = require('express-validator');
const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const passport = require('passport');

// Four different flash messages modules.
const flash = require('flash');

// Uncomment one of the below as preferred.
// const expressFlash = require('express-flash');
// const expressFlashMsg = require('express-flash-message');
// const connectFlash = require('connect-flash');

const container = require('./container');

const port = 3001;

container.resolve(function (users) {
  mongoose.Promise = global.Promise;
  const connectLink = 'mongodb://localhost:27017/chatdb';
  mongoose.connect(connectLink, {
    useNewUrlParser: true,
  });
  mongoose.set('useUnifiedTopology', true);

  const app = SetupExpress();

  function SetupExpress() {
    const app = express();
    const server = http.createServer(app);
    server.listen(port, function () {
      console.log(`Server listening on port ${port}`);
    });
    ConfigureExpress(app);

    /**
     * Settting up a express router.
     * A simple wrapper for Express's Router that allows middleware
     * to return promises. This package makes it simpler to write
     * route handlers for Express when dealing with promises by
     * reducing duplicate code.
     */

    const router = require('express-promise-router')();
    users.SetRouting(router);
    app.use(router);
  }

  function ConfigureExpress(app) {
    require('./passport/passport-local');
    app.use(express.static('public'));
    app.use(cookieParser());
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // app.use(validator());
    app.post(
      '/user',
      body('username').isEmail(),
      body('password').isLength({ min: 6 }),
      (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        User.create({
          username: req.body.username,
          password: req.body.password,
        }).then((user) => res.json(user));
      }
    );
    app.use(
      session({
        secret: 'SeCrETkEy',
        resave: true,
        saveUninitialized: true,
        store: new mongoStore({
          mongooseConnection: mongoose.connection,
        }),
      })
    );

    /**
     * Flash messages for express.
     * There're four working modules available for flash messages in express and are -
     * - flash
     * - express-flash
     * - express-flash-messages
     * - connect-flash (this one's legacy from express 2.x)
     * Now based on that, there're 4 same implementations for flash messages
     * which implement it in their own way. So, use the one (modules) that
     * suits your comfortablility best and comment the rest.
     *
     * Using flash module - app.use(flash());
     * Using express-flash module - app.use(expressFlash());
     * Using express-flash-message module.- app.use(expressFlashMsg());
     * Using connect-flash module - app.use(connectFlash());
     */

    // Using flash module.
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
  }
});
