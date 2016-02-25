//# sourceURL=api_engine.js
// "use strict";
var express = require('express');
var winston = require("winston");	// logging functionality
var dal = require("../dal");		// mysql access
var engine = require("../engine");	// engine access , device & methods
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
	.get('/category/:id', function(req, res, next) {
		var id = req.params.id;
		dal.get('categories',id , function (err, results, fields) {
			if (err) winston.error(err);
			res.send(results);
		});
	})
	.get('/', function(req, res, next) {
		res.send(engine.user_data);	
	});

module.exports = router;
