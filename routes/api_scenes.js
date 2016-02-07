//# sourceURL=api_scenes.js
// "use strict";
var express = require('express');
var winston = require("winston");	// logging functionality
var dal = require("../dal");		// mysql access
var router = express.Router();

/*
Route	HTTP Verb	Description
/api/bears	GET	Get all the bears.
/api/bears	POST	Create a bear.
/api/bears/:bear_id	GET	Get a single bear.
/api/bears/:bear_id	PUT	Update a bear with new info.
/api/bears/:bear_id	DELETE	Delete a bear.
*/ 

/* GET users listing. */
router
	.get('/', function(req, res, next) {
		var filters = req.query.filters;
		var columns = req.query.columns;
		dal.listAll('scenes', null, columns , filters, function (params, err, results, fields) {
			res.send(results);
		});
	})
	.post('/', function(req, res, next) {
		// res.setHeader('Content-Type', 'text/plain')
		// res.write('you posted:\n')
		// res.end(JSON.stringify(req.body, null, 2))
		var obj = JSON.parse(req.body.json);
		dal.add( 'scenes', obj , function (err,results, fields) {
			res.send(results);
		});
	})
	.get('/:id', function(req, res, next) {
		var id = req.params.id;
		dal.get('scenes',id , function (err, results, fields) {
			res.send(results);
		});
	})
	.put('/:id', function(req, res, next) {
		var obj = JSON.parse(req.body.json);
		dal.update('scenes',req.params.id, obj , function (err, results, fields) {
			res.send(results);
		});
	})
	.delete('/:id', function(req, res, next) {
		dal.delete('scenes',req.params.id,function (err, results, fields) {
			res.send(results);
		});
	});

module.exports = router;
