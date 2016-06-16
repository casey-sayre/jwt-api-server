'use strict';

var logger = require('./logger');
var _ = require('lodash');

module.exports = function(opts) {

  return function(req, res, next) {
    req.apiData.user = {};
    var email = req.apiData.authentication.email;
    logger.info('userDetails, email', email);
    if (!email) return next();
    var connection = req.app.locals.pool.getConnection(function(err, connection) {
      if (err) {
        return res.status(500).json({
          error: 'api server sql connection error',
        });
      }
      var query = 'SELECT id, email, firstName, lastName ' +
        'FROM api.users ' +
        'WHERE deleted = 0 AND email = ?;';
      connection.query(query, [email], function(err, rows) {
        connection.release();
        if (err) {
          return res.status(500).json({
            error: 'api server userDetails sql query error',
          });
        }
        if (rows.length !== 1) {
          return res.status(500).json({
            error: 'api server user not found',
          });
        }
        req.apiData.user = rows[0];
        return next();
      });
    });
  };
};
