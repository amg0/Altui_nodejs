//# sourceURL=altui.js
// "use strict";
var winston = require("winston");	// logging functionality
var mysql = require("mysql");		// mysql access
var config = require("../config");	// configuration
var engine = require("../engine");	// engine access , device & methods

module.exports = function(deviceid) {
	var _id = deviceid;
	winston.info('Startup Device Altui(#%d) ',_id);
	return {
		'urn:upnp-org:serviceId:altui1': {
			SetDebug: function(params,cbfunc) {
				winston.info('Device(#%d) Action:SetDebug',_id,JSON.stringify(params));	
				
				// set the new debug mode
				engine.setState(_id, 'urn:upnp-org:serviceId:altui1', 'Debug', params.newDebugMode,function(error, result) {
					cbfunc( error, "SetDebug = "+result );		// success
				});
			}
		}
	};
};
