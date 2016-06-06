'use strict';

var jwt = require('jsonwebtoken');
var fs = require('fs');
var _ = require('lodash');

module.exports = function(opts) {

  var authorizedUsernames = ['casey'];

  return function(req, res, next) {
    var token = req.token;
    if (!token) {
      return res.status(401).json({
        name: 'no token'
      });
    }
    var cert = fs.readFileSync('./keys/foo.pub.pem');
    jwt.verify(token, cert, {algorithm: 'RS256'}, function(err, decoded) {
      if (err) {
        return res.status(401).json({
          name: err.name,
          message: err.message
        });
      }
      var tokenUsername = decoded.username;
      if (!_.includes(authorizedUsernames, tokenUsername)) {
        return res.status(401).json({
          name: 'unauthorized username',
          message: tokenUsername
        });
      }
      req.username = tokenUsername;
      next();
    });
  };
};
