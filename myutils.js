//# sourceURL=myutils.js
// "use strict";
var winston = require("winston");	// logging functionality

exports.isFunction = function(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};
