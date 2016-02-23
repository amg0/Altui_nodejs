//# sourceURL=api_engine.js
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
var _user_data = {
  "devices": [],
  "rooms": [],
  "scenes": [],
  "categories": [],
  "sections": [],
  "category_filter": [
	{
		"id": 1,
		"categories": [],
		"Label": {
			"lang_tag": "ui7_all",
			"text": "All"
		}
	},
	{
		"id": 2,
		"categories": [
			"15"
		],
		"Label": {
			"lang_tag": "ui7_av_devices",
			"text": "Audio/Video"
		}
	},
	{
		"id": 3,
		"categories": [
			"2",
			"3"
		],
		"Label": {
			"lang_tag": "ui7_lights",
			"text": "Lights"
		}
	},
	{
		"id": 4,
		"categories": [
			"6"
		],
		"Label": {
			"lang_tag": "ui7_cameras",
			"text": "Cameras"
		}
	},
	{
		"id": 5,
		"categories": [
			"7"
		],
		"Label": {
			"lang_tag": "ui7_door_locks",
			"text": "Door locks"
		}
	},
	{
		"id": 6,
		"categories": [
			"4",
			"12",
			"16",
			"17",
			"18"
		],
		"Label": {
			"lang_tag": "ui7_sensors",
			"text": "Sensors"
		}
	},
	{
		"id": 7,
		"categories": [
			"5"
		],
		"Label": {
			"lang_tag": "ui7_thermostats",
			"text": "Thermostats"
		}
	}
  ],
  "timezone": "0",
  "firmware_version": "1",
  "ExtraLuaFiles": [],
  "ServerBackup": "1",
  "InstalledPlugins2": [],
  "ip_requests": [],
  "PK_City": "3888",
  "longitude": 5.99,
  "latitude": 45.99,
  "KwhPrice": "1",
  "FirstSave": 405880974,
  "upnp_devices": [],
  "sync_kit": "0000-00-00 00:00:00\n",
  "shouldHelpOverlayBeHidden": true,
  "weatherSettings": {
    "tempFormat": "C",
    "weatherCountry": "FRANCE",
    "weatherCity": "Grenoble Rhone-Alpes"
  },
  "TemperatureFormat": "C",
  "date_format": "dd\/mm\/yy",
  "City_description": "Grenoble",
  "Country_description": "FRANCE",
  "Region_description": "Rhone-Alpes",
  "setup_wizard_finished": "1",
  "awayStateAllUserNotAtHome": "0",
  "homeStateAnyUserAtHome": "0",
  "mode_change_delay": "9",
  "breach_delay": "1",
  "currency": "€",
  "timeFormat": "24hr",
  "net_pnp": "0",
  "ModeSetting": "1:,1309941;2:C*;3:DC*;4:DC*",
  "UpnpScanning": "0",
  "Scene_Num_Next": "79",
  "UpnpDiscoveryInterval": "600",
  "StartupCode": "",
  "zwave_heal": "1453392881",
  "InstalledPlugins": [],
  "PluginSettings": [],
  "PendingScenes": "",
  "UnassignedDevices": 0,
  "AutomationDevices": 0,
  "Device_Num_Next": "259",
  "DataVersion_Static": "987",
  "PluginsSyncedMMS": "0",
  "PluginsSynced": "1",
  "mode_change_time": "",
  "mode_change_mode": "",
  // "Mode": "1",
  "energy_dev_log": "62,100,6,105,181,3,54,180,182,20,148,112,4,24,149,147,",
  "users": [
    {
      "id": 1,
      "Name": "amg1",
    }
  ],
/*
  "BuildVersion": "*1.7.1707*",
  "SvnVersion": "*16068*",
  "model": "Sercomm NA301",
  "local_udn": "uuid:4d494342-5342-5645-0000-000002b03150",
  "Server_Device": "vera-us-oem-device11.mios.com",
  "Server_Device_Alt": "vera-us-oem-device12.mios.com",
  "gmt_offset": "1",
  "skin": "mios",
  "PK_AccessPoint": "999",
  "RA_Server": "vera-eu-oem-relay12.mios.com",
  "RA_Server_Back": "vera-eu-oem-relay11.mios.com",
  "ir": 0,
  "device_sync": "1,2,3,4,6,7,19,20,21,24,26,27,28,29,30,31,32,40,41,42,44,45,46,47,48,49,50,51,54,55,57,58,59,60,62,63,64,65,70,72,73,74,80,81,91,92,93,94,95,96,97,98,100,102,105,106,107,110,111,112,113,125,135,136,137,138,139,147,148,149,153,154,161,164,165,166,167,168,169,170,171,173,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,201,208,216,235,236,238,239,240,246,247,248,257,258",
  "DeviceSync": "1454865724",
  "DataVersion": 865087007,
  "LoadTime": 1454865087,
  "Using_2G": 0,
  "static_data": [],
  "overview_tabs": [],
  "SetupDevices": [],
  "category_filter": []
*/
};

router
	.get('/', function(req, res, next) {
		var filters = req.query.filters;
		var columns = req.query.columns;
		dal.listAll('devices', null, columns , filters, function (params, err, devices, fields) {
			_user_data.devices = devices;
			dal.listAll('rooms', null, columns , filters, function (params,err, rooms, fields) {
				_user_data.rooms = rooms;
				dal.listAll('scenes', null, columns , filters, function (params,err, scenes, fields) {
					_user_data.scenes = scenes;
					dal.listAll('categories', null, columns , filters, function (params,err, categories, fields) {
						_user_data.categories = categories;
						var _todo = devices.length;
						if (_todo==0)
							res.send(_user_data);
						for( var i=0 ; i<devices.length; i++ ) {
							var idx = i;
							dal.listAll('states', idx, columns , [ "deviceid="+devices[idx].id ], function (params, err, states, fields) {
								// winston.info('result states:%s',JSON.stringify(states));
								// winston.info('result param:%s',params);
								devices[params].states = states;
								_todo--;
								if (_todo==0)
									res.send(_user_data);
							} );
						}
					});
				});
			});
		});
	});

module.exports = router;
