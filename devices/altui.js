//# sourceURL=altui.js
// "use strict";
var winston = require("winston");	// logging functionality
var mysql = require("mysql");		// mysql access
var myutils = require("../myutils");	// utils
var config = require("../config");	// configuration
var engine = require("../engine");	// engine access , device & methods
var util = require('util');
var CoreDevice = require('./core');		// root for all devices

var myserviceMap = {
	['urn:upnp-org:serviceId:altui1'] : {
		SetDebug: function(params,cbfunc) {
			winston.info('Device:#%d Action:SetDebug',this._id,JSON.stringify(params));	
			// set the new debug mode
			engine.setState(this._id, 'urn:upnp-org:serviceId:altui1', 'Debug', params.newDebugMode,function(error, result) {
				if (myutils.isFunction(cbfunc))
					cbfunc( error, "SetDebug = "+result );		// success
			});
			return 0;
		}
	}
};

function AltuiDevice(deviceid) {
	CoreDevice.apply(this, arguments);	// call the base class
	// AltuiDevice.super_.apply(this, arguments);		// call the base class
	winston.info('Startup ALTUI Device:#%d ',deviceid);
	this.test = 'toto';
	for ( var p in myserviceMap ) {
		this.serviceMap[p] = myserviceMap[p];
	}
};

util.inherits(AltuiDevice, CoreDevice);	// inherits methods from base class

AltuiDevice.prototype.CallAction = function(service,action,params,cbfunc) {
	if (this.serviceMap[service] && this.serviceMap[service][action] )
		return (this.serviceMap[service][action]).call(this,params,cbfunc);
	winston.warn("Unknown service/action %s/%s",service,action);
	return -1;
};


module.exports = AltuiDevice;
