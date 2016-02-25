//# sourceURL=app.js
// "use strict";
var winston = require("winston");	// logging functionality
winston.add(winston.transports.File, { filename: 'output.log' });
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var dal = require("./dal");		// data model mysql access
var engine = require("./engine");	// engine access , device & methods
var api_variables = require('./routes/api_variables');
var api_devices = require('./routes/api_devices');
var api_rooms = require('./routes/api_rooms');
var api_engine = require('./routes/api_engine');
var api_scenes = require('./routes/api_scenes');


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// enable CORS on all routesapp.use(function(req, res, next) {
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// To serve static files such as images, CSS files, and JavaScript files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/views',express.static(path.join(__dirname, 'views')));

// To serve Routes
dal.init( function(err) {
	engine.initEngine( function(user_data) {
		
		winston.info(JSON.stringify(user_data));

		app.use('/', routes);
		app.use('/api/variables', api_variables);
		app.use('/api/engine_data', api_engine);
		app.use('/api/devices', api_devices);
		app.use('/api/rooms', api_rooms);
		app.use('/api/scenes', api_scenes);
		winston.info("Finished Initialize API routes");
				
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
	});
});


module.exports = app;
