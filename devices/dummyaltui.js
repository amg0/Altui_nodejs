//# sourceURL=dummyaltui.js
// "use strict";
var winston = require("winston");	// logging functionality
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
var mysql = require("mysql");		// mysql access

module.exports = function(deviceid) {
	var _id = deviceid;
	winston.info('Startup Device DummyAltui(#%d) ',_id);
	return {
		SetDebug: function(params) {
			winston.info('Device(#%d) Action:SetDebug',_id);			
		}
	};
};