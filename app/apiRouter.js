'use strict';

var logger = require('./logger');
var util = require('util');

module.exports = function(opts) {

  var router = require('express').Router();

  router.use('/auth', require('./authenticationRouter')(opts));
  router.use('/public', require('./publicRouter')(opts));
  router.use('/analytics', require('./analyticsRouter')(opts));

  return router;
};
