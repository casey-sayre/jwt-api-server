'use strict';

var gulp = require('gulp');
var server = require('gulp-develop-server');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var fs = require('fs');

var listenOptions = {
  path: './index.js',
  env: {
    NODE_PORT: 5000,
    NODE_KEY_PATH: '../keys/id_rsa.pub.pem',
    NODE_SQL_USER: 'root',
    NODE_SQL_HOST: 'localhost',
    NODE_SQL_PW: 'rootpassword',
    NODE_AUTH_URL: 'http://localhost:5100'
  }
};
livereload.options.port = 35731;

var serverFiles = [
  './*.js',
  '!./gulpfile.js'
];

gulp.task('lint', function() {
  gulp.src('./*.js')
    .pipe(jshint('../.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('startServer', function() {
  server.listen(listenOptions, livereload.listen);
});

gulp.task('default', ['lint', 'startServer'], function() {
  function restart(file) {
    server.changed(function(error) {
      if (!error) livereload.changed(file.path);
    });
  }
  gulp.watch(serverFiles, ['lint']).on('change', restart);
});
