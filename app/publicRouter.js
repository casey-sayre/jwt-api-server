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

  router.get('/news', function(req, res, next) {
    return res.json({news: [
      {
        time: '2016-06-09',
        headline: 'Version 0.01 is Available on GitHub',
        copy: 'An evolving verion of the jwt-api-server is now available on GitHub'
      },
      {
        time: '2016-06-02',
        headline: 'Front-to-Back Web App Under Development',
        copy: 'Material Design, Angular, REST, NodeJs, JsonWebToken, ...'
      }
    ]});
  });

  return router;
};
