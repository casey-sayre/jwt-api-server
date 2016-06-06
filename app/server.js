'use strict';

var logger = require('./logger');

module.exports = function(app, opts) {

  var port = opts.port;

  var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    logger.info('listening at http://%s:%s', host, port);
  });

  process.on('SIGINT', function()
  {
    logger.info( 'Received SIGINT, closing server');
    server.close();
  });
  server.on('close', function() {
    logger.info('server closed, cleaning up');
    app.locals.pool.end(function(err) {
      if (err) {
        logger.error('connection pool end error');
      } else {
        logger.info('connection pool ended');
      }
    });
  });
};
