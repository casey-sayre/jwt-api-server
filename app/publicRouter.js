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

  return router;
};
