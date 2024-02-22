var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

var api = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send({ error: err.toString() })
});

module.exports = app;
