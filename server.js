const express = require('express');
const ejs = require('ejs');
const http = require('http');
const container = require('./container');

const port = 3001;

container.resolve(function (users) {
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
    app.use(express.static('public'));
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
});
