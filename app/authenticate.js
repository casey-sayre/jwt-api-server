'use strict';

var logger = require('./logger');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var _ = require('lodash');

module.exports = function(opts) {

  var publicKeyPath = opts.keyPath;

  return function(req, res, next) {
    req.apiData = req.apiData || {};
    req.apiData.authentication = {};
    var token = req.token;
    if (!token) {
      return next();
    }
    var cert = fs.readFileSync(publicKeyPath);
    jwt.verify(token, cert, {algorithm: 'RS256'}, function(error, decoded) {
      if (error) {
        logger.error('%j', {error: error});
        return res.status(401).json({
          error: 'invalid token'
        });
      }
      var tokenUsername = decoded.username;
      req.apiData.authentication.email = tokenUsername;
      next();
    });
  };
};
