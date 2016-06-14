'use strict';

var logger = require('./logger');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var _ = require('lodash');

module.exports = function(opts) {

  var authorizedUsernames = ['csayre@turnaboutsystems.com', 'info+demo@turnaboutsystems.com'];
  var publicKeyPath = opts.keyPath;

  return function(req, res, next) {
    var token = req.token;
    if (!token) {
      return res.status(401).json({
        error: 'no token provided'
      });
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
      if (!_.includes(authorizedUsernames, tokenUsername)) {
        return res.status(401).json({
          error: 'token user is unauthorized',
          detail: tokenUsername
        });
      }
      req.apiData = req.apiData || {};
      req.apiData.authorization = {
        username: tokenUsername
      };
      next();
    });
  };
};
