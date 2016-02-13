//# sourceURL=index.js
// "use strict";
var winston = require("winston");	// logging functionality
var express = require('express');
var config = require('../config');
var router = express.Router();

var ALTUI_SERVICE = "urn:schemas-upnp-org:service:altui:1";

/* GET home page. */
winston.info('xxxxxxxxx test xxxxxxxxxxxxx');
winston.info('config:'+JSON.stringify(config));
router.get('/', function(req, res, next) {
	var model = { 
		title: 'Express',
		custompages: '',
		ThemeCSS: '',
		mydeviceid: 1,
		ServerOptions: '',
		extracontroller: "",
		firstuserdata: "",
		jspath: config.jspath,
		devicetypes: {
		  "info": {
				"controllerType" : config.controllerType,
				"ui7Check" : "1",	// luup.variable_get(ALTUI_SERVICE, "UI7Check", deviceID) or "",
				"debug" : "0",		// luup.variable_get(ALTUI_SERVICE, "Debug", newDebugMode, lul_device)
				"PluginVersion" : config.version,	// luup.variable_get(ALTUI_SERVICE, "Version", deviceID) or "",
				"RemoteAccess" : ""			// luup.variable_get(ALTUI_SERVICE, "RemoteAccess", deviceID) or ""
		  },
		  "urn:schemas-micasaverde-com:device:PowerMeter:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawPowerMeter",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-futzle-com:device:CombinationSwitch:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawCombinationSwitch",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:richardgreen:device:VeraAlert:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawVeraAlerts",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-futzle-com:device:UPnPProxy:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawPnPProxy",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:Heater:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawHeater",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawZoneThermostat",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:DoorLock:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawDoorLock",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:DoorSensor:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawDoorSensor",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-rts-services-com:device:ProgramLogicTS:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawProgLogicTimerSwitch",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:RGBController:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawBinaryLight",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:PowerMeter:2": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawPowerMeter",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-dcineco-com:device:MSwitch:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawMultiswitch",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:IPX800:1": {
			"DeviceDrawFunc": "ALTUI_IPhoneLocator.drawIPX",
			"ScriptFile": "J_ALTUI_iphone.js"
		  },
		  "urn:schemas-arduino-cc:device:arduino:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawMySensors",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:Keypad:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawKeypad",
			"ControlPanelFunc": "ALTUI_PluginDisplays.drawKeypadControlPanel",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:FloodSensor:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawFlood",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-rts-services-com:device:DayTime:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawDayTime",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:Sonos:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawSonos",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-cd-jackson-com:device:SystemMonitor:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawSysMonitor",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:DigitalSecurityCamera:2": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawCamera",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:DimmableLight:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawDimmable",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:TempLeakSensor:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawTempLeak",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-utz-com:device:GCal:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawGCal",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:DimmableRGBLight:2": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawDimmableRGB",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:DimmableRGBLight:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawDimmableRGB",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:VSwitch:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawVswitch",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:demo-micasaverde-com:device:weather:1": {
			"DeviceIconFunc": "ALTUI_PluginDisplays.drawWeatherIcon",
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawWeather",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:IPhoneLocator:1": {
			"StyleFunc": "ALTUI_IPhoneLocator.getStyle",
			"DeviceDrawFunc": "ALTUI_IPhoneLocator.drawIPhone",
			"ScriptFile": "J_ALTUI_iphone.js"
		  },
		  "urn:schemas-rts-services-com:device:ProgramLogicEG:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawPLEG",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:VContainer:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawMultiString",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:altui:1": {
			"DeviceDrawFunc": "ALTUI_IPhoneLocator.drawAltUI",
			"ScriptFile": "J_ALTUI_iphone.js"
		  },
		  "urn:schemas-micasaverde-com:device:HumiditySensor:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawHumidity",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-futzle-com:device:CountdownTimer:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawCountDown",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:MotionSensor:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawMotion",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-cd-jackson-com:device:DataMine:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawDataMine",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:SmokeSensor:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawSmoke",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-futzle-com:device:holidayvirtualswitch:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawVacation",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-a-lurker-com:device:InfoViewer:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawInfoViewer",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:cplus:1": {
			"DeviceDrawFunc": "ALTUI_IPhoneLocator.drawCanalplus",
			"ControlPanelFunc": "ALTUI_IPhoneLocator.drawCanaplusControlPanel",
			"ScriptFile": "J_ALTUI_iphone.js"
		  },
		  "urn:antor-fr:device:SamsungTVRemote:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawBinaryLight",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:TemperatureSensor:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawTempSensor",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:DigitalSecurityCamera:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawCamera",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-upnp-org:device:BinaryLight:1": {
			"StyleFunc": "ALTUI_PluginDisplays.getStyle",
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawBinaryLight",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:LightSensor:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawLight",
			"ScriptFile": "J_ALTUI_plugins.js"
		  },
		  "urn:schemas-micasaverde-com:device:WindowCovering:1": {
			"DeviceDrawFunc": "ALTUI_PluginDisplays.drawWindowCover",
			"ScriptFile": "J_ALTUI_plugins.js"
		  }
		}
	};
	res.render('index', model ,function(err, html) {
		res.send(html);
	});
});

module.exports = router;

