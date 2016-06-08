'use strict';

var logger = require('./logger');
var util = require('util');

module.exports = function(opts) {

  var router = require('express').Router();

  router.get('/total',
    require('./authorization')(opts),
    function(req, res, next) {
      return res.json({
        total: 6
      });
    }
  );

  return router;
};
