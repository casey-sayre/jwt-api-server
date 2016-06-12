'use strict';

var logger = require('./logger');
var util = require('util');

module.exports = function(opts) {

  var router = require('express').Router();

  router.get('/version', function(req, res, next) {
    return res.json({
      version: '0.01'
    });
  });

  router.get('/news', function(req, res, next) {
    var connection = req.app.locals.pool.getConnection(function(err, connection) {
      if (err) {
        return res.status(500).json({
          error: 'api server sql connection error',
        });
      }
      var query = 'SELECT id, time, headline, copy FROM api.news ORDER BY time DESC LIMIT 10';
      connection.query(query, function(err, rows) {
        connection.release();
        if (err) {
          return res.status(500).json({
            error: 'api server sql query error',
          });
        }
        return res.json({
          news: rows
        });
      });
    });
  });

  return router;
};
