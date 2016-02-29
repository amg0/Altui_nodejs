//# sourceURL=core.js
// "use strict";
var winston = require("winston");	// logging functionality
var mysql = require("mysql");		// mysql access
var config = require("../config");	// configuration
var engine = require("../engine");	// engine access , device & methods

function CoreDevice(deviceid) {
	this.serviceMap = {};
	this._id = deviceid;
	winston.info('Startup Device:#%d', this._id);
}

CoreDevice.prototype = {
	ID : function() {
		winston.info('Device:#%d Action:ID()',this._id,JSON.stringify(arguments));	
		return this._id;
	}
}

module.exports = CoreDevice;