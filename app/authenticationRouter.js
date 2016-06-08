'use strict';

var logger = require('./logger');
var util = require('util');

module.exports = function(opts) {

  var authServerUrl = opts.authServer;

  var router = require('express').Router();

  router.post('/login', function(req, res, next) {

    // forward req to authentication server using 'request' package
    var request = require('request');
    var payload = {
      body: req.body,
      url: util.format('%s/login', authServerUrl),
      json: true
    };
    request.post(payload, function(error, response, body) {
      if (error) {
        logger.error('authenticationProxy login error %j', {
          error: error
        });
        return res.status(500).json({
          error: 'authenticationProxy login error'
        });
      }
      return res.status(response.statusCode).json(body);
    });
  });

  return router;
};
