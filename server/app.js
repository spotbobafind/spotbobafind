const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors=require('cors');

const api = require('./routes/api');

const app = express();

app.use(cors());
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
