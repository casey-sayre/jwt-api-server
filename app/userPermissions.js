'use strict';

var logger = require('./logger');
var _ = require('lodash');

module.exports = function(opts) {

  return function(req, res, next) {
    var userId = req.apiData.user.id || -1;
    var connection = req.app.locals.pool.getConnection(function(err, connection) {
      if (err) {
        return res.status(500).json({
          error: 'api server sql connection error',
        });
      }
      var query = 'SELECT CASE WHEN u.id IS NOT NULL THEN 1 ELSE 0 END AS granted, ' +
        'p.id, p.permission, p.description ' +
        'FROM api.users u ' +
        'JOIN api.userPermissions up ON up.userId = u.id ' +
        'RIGHT JOIN api.permissions p ON p.id = up.permissionId AND up.userId = ?';

      connection.query(query, [userId], function(err, rows) {
        connection.release();
        if (err) {
          logger.error('userPermissions query', err);
          return res.status(500).json({
            error: 'api server permissions sql query error',
          });
        }
        req.apiData.userPermissions = rows;
        return next();
      });
    });
  };
};
