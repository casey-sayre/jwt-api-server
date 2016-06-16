'use strict';

var logger = require('./logger');
var _ = require('lodash');
var util = require('util');

module.exports = function(opts) {

  var router = require('express').Router();

  router.get('/historical',
    require('./authenticate')(opts),
    require('./userDetails')(opts),
    require('./userPermissions')(opts),
    require('./checkPermissions')('access-stocks'),
    function(req, res, next) {
      var connection = req.app.locals.pool.getConnection(function(err, connection) {
        if (err) {
          return res.status(500).json({
            error: 'api server sql connection error',
          });
        }
        var query = 'SELECT tradeDate, symbol, open, high, low, close, volume, adjClose FROM api.historicalPrices ORDER BY tradeDate DESC LIMIT 10';
        connection.query(query, function(err, rows) {
          connection.release();
          if (err) {
            return res.status(500).json({
              error: 'api server sql query error',
            });
          }
          return res.json({
            historicalPrices: rows
          });
        });
      });
    });

  return router;
};
