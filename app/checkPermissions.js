'use strict';

var logger = require('./logger');
var _ = require('lodash');

module.exports = function(requiredPermission) {

  return function(req, res, next) {
    var requiredPermEntry = _.find(req.apiData.userPermissions, function(permEntry) {
      return permEntry.permission === requiredPermission;
    });
    if (!requiredPermEntry || !requiredPermEntry.granted) {
      return res.status(403).json({
        error: 'user lacks permission ' + requiredPermission
      });
    }
    return next();
  };
};
