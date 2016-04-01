/*
* @Author: Grant McGovern
* @Date:   2016-03-29 12:40:17
* @Last Modified by:   Grant McGovern
* @Last Modified time: 2016-03-31 22:04:11
*/

var express = require('express'),
    path = require('path'), 
    favicon = require('serve-favicon'), 
    logger = require('morgan'), 
    cookieParser = require('cookie-parser'), 
    bodyParser = require('body-parser');

// Database
var db = require('./model/db'),
    user = require('./model/users'),
    post = require('./model/posts');

var routes = require('./routes/index'),
    users = require('./routes/users'),
    docs = require('./routes/docs'),
    posts = require('./routes/posts');


// App
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/docs', docs);
app.use('/users', users);
app.use('/posts', posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
