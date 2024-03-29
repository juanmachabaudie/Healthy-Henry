const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const passport = require('./passport.js');

require('./db.js');

const server = express();

server.name = 'API';

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.all("*", function (req, res, next) {
  passport.authenticate("bearer", (err, user) => { // el bearer es como un middleware hecho a mano, identifica el token, ve si es valido y devuelve el usuario que está en este token. Pregunta si hay un error; si no, envía el user. 
    if (err) return next(err);
    if (user) { req.user = user; } // agarra el usuario y lo mete dentro de req. 
    return next(); // si no está loggeado, va a ir a la próxima función
  }) (req, res, next);
});
server.use(cookieParser("secret"));

server.use(passport.initialize());
server.use(passport.session());
server.use('/', routes);

// server.use(passport.initialize());

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
