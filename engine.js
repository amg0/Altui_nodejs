//# sourceURL=engine.js
// "use strict";

var winston = require("winston");	// logging functionality
var mysql = require("mysql");		// mysql access
var dal = require("./dal");		// mysql access
var device_objects={};

var user_data = {
  "devices": [],
  "rooms": [],
  "scenes": [],
  "categories": [],
  "sections": [],
  "category_filter": [ ],
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

var createDevice = function(id,module) {
	winston.info("createDevice:",id,module);
	device_objects[id] = require("./devices/"+module)(id);
	device_objects[id].SetDebug({test:1});
};

var debugDump = function() {
	winston.info("device_objects initialized:"+JSON.stringify(device_objects));
};

exports.user_data = user_data;

exports.runAction = function(id,service,action,params) {
	winston.info("runAction:",id,service,action,params);
};

exports.initEngine = function( callback ) {	// (callback)(user_data)
	winston.info("Engine: initEngine()");
	dal.listAll('devices', null, null , null, function (params, err, devices, fields) {
		user_data.devices = devices;
		dal.listAll('rooms', null, null , null, function (params,err, rooms, fields) {
			user_data.rooms = rooms;
			dal.listAll('scenes', null, null , null, function (params,err, scenes, fields) {
				user_data.scenes = scenes;
				dal.listAll('categories', null, null , null, function (params,err, categories, fields) {
					user_data.categories = categories;
					var _todo = devices.length;
					if (_todo==0)
						res.send(user_data);
					for( var i=0 ; i<devices.length; i++ ) {
						var idx = i;
						dal.listAll('devicetypes', idx, null, [ "device_type='"+devices[idx].device_type+"'"], function (params, err, devicetypes, fields) {
							if (devicetypes[0].nodemodule!='') {
								createDevice( devices[params].id , devicetypes[0].nodemodule )
							}
							dal.listAll('states', idx, null , [ "deviceid="+devices[idx].id ], function (params, err, states, fields) {
								user_data.devices[params].states = states;
								_todo--;
								if (_todo==0) {
									debugDump();
									(callback)(user_data);
								}
							});
						});
					}
				});
			});
		});
	});
};

