'use strict';

var logger = require('./logger');

logger.info('startup');

var config = {
  keyPath: process.env.NODE_KEY_PATH,
  port: process.env.NODE_PORT,
  authServer: process.env.NODE_AUTH_URL,
  mySql: {
    host: process.env.NODE_SQL_HOST,
    user: process.env.NODE_SQL_USER,
    password: process.env.NODE_SQL_PW
  }
};

var express = require('express');
var app = express();

var bearerToken = require('express-bearer-token');
var cors = require('cors');
var bodyParser = require('body-parser');
app.use(bearerToken());
app.use(cors()); // NOTE cors from anywhere
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host: config.mySql.host,
  user: config.mySql.user,
  password: config.mySql.password
});
app.locals.pool = pool;

app.use('/api', require('./apiRouter')(config));

app.use(function(req, res, next) {
  logger.error('Unrouted request! %s %s', req.method, req.url);
  next();
});
app.use(function(err, req, res, next) {
  logger.error(err);
  next(err);
});

require('./server')(app, config);
