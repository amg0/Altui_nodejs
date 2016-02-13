//# sourceURL=J_ALTUI_api.js
// "use strict";
// http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// ======================================================================
// Global for UI5 UI7 javascript compatibility
// ======================================================================

var jsonp={};
jsonp.ud={};
jsonp.ud.devices=[];
jsonp.ud.scenes=[];
jsonp.ud.rooms=[];
jsonp.ud.static_data=[];
jsonp.ud.users=[];

var sysinfoJson={};
var user_changes=0;		// for PLEG


var data_request_url = window.location.pathname+'?';
var command_url = window.location.pathname.replace('/port_3480/data_request','/port_49451');
var send_command_url = window.location.pathname.replace('/port_3480/data_request','/port_3480');
var _JSAPI_ctx={};

function set_JSAPI_context(ctx) {
	_JSAPI_ctx = $.extend( {
			set_panel_html_callback: null,
			deviceid: 0,
			altuiid: NULL_DEVICE,
			controllerid: 0
		}, ctx );

	// UI5 compatibility
	jsonp = MultiBox.initializeJsonp(_JSAPI_ctx.controllerid);
	sysinfoJson= MultiBox.initializeSysinfo(_JSAPI_ctx.controllerid);
	application.userData = jsonp.ud;
};


function xml_encode(str)
{
    if(str == undefined)
    {
        alert("error in xml_encode: input undefined");
        return;
    }
    str	=	trim(str.toString());

    str = str.replace(new RegExp("[" + "&" + "]", "g"), "&amp;");
    str = str.replace(new RegExp("[" + "<" + "]", "g"), "&lt;");
    str = str.replace(new RegExp("[" + ">" + "]", "g"), "&gt;");
    str = str.replace(new RegExp("[" + "\"" + "]", "g"), "&quot;");
    str = str.replace(new RegExp("[" + "'" + "]", "g"), "&apos;");
    str = str.replace(/%/gi,'&#37;');

    return str;
};

function xml_decode(str)
{
    if(str == undefined)
    {
        alert("error in xml_decode: input undefined");
        return;
    }
    str	=	trim(str.toString());

    str = str.replace(new RegExp("&amp;", "g"), "&");
    str = str.replace(new RegExp("&lt;", "g"), "<");
    str = str.replace(new RegExp("&gt;", "g"), ">");
    str = str.replace(new RegExp("&quot;", "g"), "\"");
    str = str.replace(new RegExp("&apos;", "g"), "'");

    return str;
};

// function set_set_panel_html_callback(cb) {
	// if ($.isFunction(cb))
		// set_panel_html_cb =cb;
// };

function set_panel_html(html) {
	if ($.isFunction(_JSAPI_ctx.set_panel_html_callback))
		(_JSAPI_ctx.set_panel_html_callback)(html);
};

function log_message(msg) {
	PageMessage.message( msg, "info");
};

function set_infobox(str,mode){
	PageMessage.message( str, (mode=="success") || (mode=="error") ? mode : "info" );
};

function has_changes(msg) {
	PageMessage.message( msg, "info");
};

//
// some device like Wakeup Light uses this from ergy.js
//
function trim(stringToTrim)
{
    return stringToTrim.replace(/^\s+|\s+$/g,"");
}
function get_node_obj(nodeObj,nodeID)
{
    var itemsCount=nodeObj.length;
    for(var i=0;i<itemsCount;i++){
        if(nodeObj[i] && nodeObj[i].id==parseInt(nodeID)){
            return nodeObj[i];
        }
    }
    return undefined;
}
function get_node_index(nodeObj,nodeID){
    var itemsCount=nodeObj.length;
    for(var i=0;i<itemsCount;i++){
        if(nodeObj[i] && nodeObj[i].id==nodeID){
            return i;
        }
    }
    return 0;
}

function get_new_timer_id(timersArray){
    var timersNo = timersArray.length;
    var maxID=0;
    for(var i=0;i<timersNo;i++){
        if(timersArray[i].id>maxID){
            maxID = timersArray[i].id;
        }
    }
    return maxID+1;
}

var _spinDialog = null;
function show_loading(message) {
	_spinDialog = DialogManager.createSpinningDialog(message);
	_spinDialog.modal('show');
};

function hide_loading() {
	_spinDialog.modal('hide');
};

//
// PLEG uses this from cpanel
//
function sortByName(a, b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
};

var altuiSortByName=sortByName;
function altuiSortByName2(a, b) {
    var x = a.Name.toLowerCase();
    var y = b.Name.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
};

function get_device_index(deviceID){
    var devicesCount=jsonp.ud.devices.length;
    for(var i=0;i<devicesCount;i++){
        if(jsonp.ud.devices[i] && jsonp.ud.devices[i].id==deviceID){
            return i;
        }
    }
};

function get_device_obj(deviceID){
    var devicesCount=jsonp.ud.devices.length;
    for(var i=0;i<devicesCount;i++){
        if(jsonp.ud.devices[i] && jsonp.ud.devices[i].id==deviceID){
            return jsonp.ud.devices[i];
        }
    }
};

function get_trigger_info(sceneID,triggerIndex){
	var scene = MultiBox.getSceneByID(_JSAPI_ctx.controllerid,sceneID);
	if (scene==null)
		return null;
	return scene.triggers[ triggerIndex ] != undefined ? scene.triggers[ triggerIndex ] : null;
}

function cloneObject(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
};

function get_event_definition(DeviceType){
    var itemsCount=jsonp.ud.static_data.length;
    for(var i=0;i<itemsCount;i++){
        if(jsonp.ud.static_data[i] && jsonp.ud.static_data[i].DeviceType==DeviceType){
            return jsonp.ud.static_data[i].eventList2;
        }
    }
}

function new_scene_id(){
	return MultiBox.getNewSceneID(_JSAPI_ctx.controllerid);
}

function get_device_state(deviceId, serviceId, variable, dynamic) {
	var device = MultiBox.getDeviceByID( _JSAPI_ctx.controllerid , deviceId);
	var result = MultiBox.getStatus( device, serviceId, variable );
	return (result==null) ? false : result;
};

function set_device_state (deviceId, serviceId, variable, value, dynamic) {
	// -1 : ALTUI mode , triggers a UPNP http save
	// 0 : means not dynamic, will require a save
	// 1 : means dynamic, lost at the next restart if not save
	if (dynamic==undefined)
		dynamic = 0;
	var device = MultiBox.getDeviceByID(_JSAPI_ctx.controllerid,deviceId);
	MultiBox.setStatus( device, serviceId, variable, value  , dynamic );
	return true;
};

// veraalert uses req object
function commandSent(response){}

var req={
	sendCommand: function(query,callback,param){
		jQuery.ajax({
			url: data_request_url+query,
			success: function(response,status,obj){
				if(typeof(callback)!="undefined"){
					callback(obj.responseText,param);
				}
			}
		});
	},	
};

var Ajax = (function(window,undefined) {
	function Response(data,jqXHR) {
		return {
			getHeader: function(name) { return (jqXHR.getResponseHeader(name) || null); },
			headerJSON: null,
			responseText:data
		};
	};
	return {
		Request: function (url,opts) {
			var ajaxopts={};
			var options = $.extend({
				method:"GET",
				parameters: {},
				onSuccess : null,
				onFailure : null,
				onComplete : null,
			}, opts);
			
			var urlHead = url;
			var params = [];
			if ($.isArray(options.parameters)) {
				$.each(options.parameters, function(index,value) {
					params.push( index+"="+value );	// we assume nothing requires uri encoding here
				});
				if (params.length>0) {
					urlHead = urlHead + "?" + params.join('&');
				}
				ajaxopts={
					url: urlHead,
					type: options.method,
					// data: options.parameters,
					// processData : false,			
					// dataType: "text"
				};
			} 
			else {
				ajaxopts={
					url: urlHead,
					type: options.method,
					data: options.parameters,
					// processData : false,			
					// dataType: "text"
				};
			}
			// if this is for a remove controller, we need to proxify the url ( and the result )
			// so that controller 0 acts as a proxy for the web request
			// the hack is that vera only supports parameters with a "GET" & on the url
			var controller = MultiBox.getControllers()[_JSAPI_ctx.controllerid];
			var upnphelper = controller.controller.getUPnPHelper();
			if (_JSAPI_ctx.controllerid>0) {
				var querystring = $.param(ajaxopts.data);
				ajaxopts.data=null;
				ajaxopts.url = upnphelper.proxify("http://{0}{1}?{2}".format(controller.ip,ajaxopts.url,querystring));
			}
			var jqxhr = $.ajax(ajaxopts )
				.done(function(data, textStatus, jqXHR) {
					upnphelper.unproxifyResult(data, textStatus, jqXHR, function(data,textStatus,jqXHR) {
						if ($.isFunction( options.onSuccess )) {
							var response = new Response(data,jqXHR);
							(options.onSuccess)(response);
						}
					});
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					if ($.isFunction( options.onFailure )) {
						(options.onFailure)(textStatus);
					}
				})
				.always(function(data_jqXHR, textStatus, jqXHR_errorThrown) {
					if ($.isFunction( options.onComplete )) {
						(options.onComplete)("");
					}
				});
		}
	};
})();

// J_Harmony , J_Harmony_UI7.ss
var Utils = ( function (undefined) {
	return {
		logDebug: function (message) {
			if ($.isPlainObject(window.AltuiDebug)) {
				AltuiDebug.debug(message);
			} else {
				//console.info(message);
			}
		},
		logError : function(s) 			{ PageMessage.message(s,"error"); AltuiDebug.debug("Utils.logError: "+s);},
		isValidIp: function(ip) 		{
			var reg = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\\d{1,5})?$', 'i');
			return(reg.test(ip));
		},
		getLangString: function(s1,s2)	{ return _T(s2);},	// returned localized version of the string
		xmlEncode : function(str)		{ return xml_encode(str); }
	}
})();

var Interface = function (undefined) {
	return {
		showMessagePopup: function(msg,code) { PageMessage.message(msg,"success"); },
		showMessagePopupError: function(msg) { PageMessage.message(msg,"error"); },
		showStartupModalLoading	: function() {	show_loading(); },
		showModalLoading		: function() {	show_loading(); },
		hideModalLoading		: function() {	hide_loading(); }
	}
};
var myInterface = new Interface();

var DOMPurify = (function(undefined) {
	return {
		sanitize: function(str)	{return str;}
	}
})();

var application = (function(undefined) {
	return {
		userData:null,
		sendCommandSaveUserData: function(bSilent)	{ },
		sendCommand : function(params, va_RegisterResult, va_SendError, deviceID) {},
		userDataRemove : function (type,id) { },
		luReload : function() { 
			MultiBox.reloadEngine(_JSAPI_ctx.controllerid); 
		},
		getSceneObject : function(SceneID) {
			var scene = MultiBox.getSceneByID(_JSAPI_ctx.controllerid,SceneID);
			return scene;
		}
	}
})();


// extract from constant.js
var DEVICETYPE_HOME_AUTO_GATEWAY = "urn:schemas-micasaverde-com:device:HomeAutomationGateway:1";
var DEVICETYPE_BINARY_LIGHT = "urn:schemas-upnp-org:device:BinaryLight:1";
var DEVICETYPE_DIMMABLE_LIGHT = "urn:schemas-upnp-org:device:DimmableLight:1";
var DEVICETYPE_THERMOSTAT = "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1";
var DEVICETYPE_HUMIDITY_SENSOR = "urn:schemas-micasaverde-com:device:HumiditySensor:1";
var DEVICETYPE_MULTI_IO = "urn:schemas-micasaverde-com:device:MultiIO:1";
var DEVICETYPE_DOOR_LOCK = "urn:schemas-micasaverde-com:device:DoorLock:1";
var DEVICETYPE_DOOR_SENSOR = "urn:schemas-micasaverde-com:device:DoorSensor:1";
var DEVICETYPE_ZWAVE_NETWORK = "urn:schemas-micasaverde-com:device:ZWaveNetwork:1";
var DEVICETYPE_INSTEON_NETWORK = "urn:schemas-micasaverde-com:device:InsteonNetwork:1";
var DEVICETYPE_USB_UIRT = "urn:schemas-micasaverde-com:device:USBUIRT:1";
var DEVICETYPE_TEMPERATURE_SENSOR = "urn:schemas-micasaverde-com:device:TemperatureSensor:1";
var DEVICETYPE_POWER_METER = "urn:schemas-micasaverde-com:device:PowerMeter:1";
var DEVICETYPE_MOTION_SENSOR = "urn:schemas-micasaverde-com:device:MotionSensor:1";
var DEVICETYPE_SMOKE_SENSOR = "urn:schemas-micasaverde-com:device:SmokeSensor:1";
var DEVICETYPE_LIGHT_SENSOR = "urn:schemas-micasaverde-com:device:LightSensor:1";
var DEVICETYPE_IR_TRANSMITTER = "urn:schemas-micasaverde-com:device:IrTransmitter:1";
var DEVICETYPE_WINDOW_COVERING = "urn:schemas-micasaverde-com:device:WindowCovering:1";
var DEVICETYPE_GENERIC_IO = "urn:schemas-micasaverde-com:device:GenericIO:1";
var DEVICETYPE_REMOTE_CONTROL = "urn:schemas-micasaverde-com:device:RemoteControl:1";
var DEVICETYPE_COMBO_DEVICE = "urn:schemas-micasaverde-com:device:ComboDevice:1";
var DEVICETYPE_CAMERA = "urn:schemas-upnp-org:device:DigitalSecurityCamera:1";
var DEVICETYPE_CAMERA2 = "urn:schemas-upnp-org:device:DigitalSecurityCamera:2";
var DEVICETYPE_SERIALPORT = "urn:micasaverde-org:device:SerialPort:1";
var DEVICETYPE_SCENE_CONTROLLER = "urn:schemas-micasaverde-com:device:SceneController:1";
var DEVICETYPE_SCENE_CONTR_LED = "urn:schemas-micasaverde-com:device:SceneControllerLED:1";
var DEVICETYPE_ENERGY_CALCULATOR = "urn:schemas-micasaverde-com:device:EnergyCalculator:1";
var DEVICETYPE_TEMP_LEAK_SENSOR = "urn:schemas-micasaverde-com:device:TemperatureLeakSensor:1";
var DEVICETYPE_SCENE = "urn:schemas-micasaverde-com:device:Scene:1";
var DEVICETYPE_TV = "urn:schemas-micasaverde-com:device:tv:1";
var DEVICETYPE_CABLE = "urn:schemas-micasaverde-com:device:cable:1";
var DEVICETYPE_SATELLITE = "urn:schemas-micasaverde-com:device:satellite:1";
var DEVICETYPE_VIDEO_ACCESSORY = "urn:schemas-micasaverde-com:device:videoaccessory:1";
var DEVICETYPE_VCR_DVR = "urn:schemas-micasaverde-com:device:vcrdvd:1";
var DEVICETYPE_DVD_BLURAY = "urn:schemas-micasaverde-com:device:dvdbluray:1";
var DEVICETYPE_RECEIVER = "urn:schemas-micasaverde-com:device:receiver:1";
var DEVICETYPE_AMP = "urn:schemas-micasaverde-com:device:amp:1";
var DEVICETYPE_CD = "urn:schemas-micasaverde-com:device:cd:1";
var DEVICETYPE_MISC_HOME_CONTROL = "urn:schemas-micasaverde-com:device:mischomecontrol:1";
var DEVICETYPE_AV_MISC = "urn:schemas-micasaverde-com:device:avmisc:1";
var DEVICETYPE_VIRTUAL_DEVICE = "urn:schemas-micasaverde-com:device:VirtualDevice:1";
var DEVICEFILE_BINARY_LIGHT = "D_BinaryLight1.xml";
var DEVICEFILE_DIMMABLE_LIGHT = "D_DimmableLight1.xml";
var DEVICEFILE_THERMOSTAT = "D_HVAC_ZoneThermostat1.xml";
var DEVICEFILE_HUMIDITY_SENSOR = "D_HumiditySensor1.xml";
var DEVICEFILE_MULTI_IO = "D_GC100.xml";
var DEVICEFILE_DOOR_LOCK = "D_DoorLock1.xml";
var DEVICEFILE_DOOR_SENSOR = "D_DoorSensor1.xml";
var DEVICEFILE_ZWAVE_NETWORK = "D_ZWaveNetwork.xml";
var DEVICEFILE_INSTEON_NETWORK = "D_InsteonNetwork.xml";
var DEVICEFILE_USB_UIRT = "D_USB_UIRT.xml";
var DEVICEFILE_TEMPERATURE_SENSOR = "D_TemperatureSensor1.xml";
var DEVICEFILE_POWER_METER = "D_PowerMeter1.xml";
var DEVICEFILE_MOTION_SENSOR = "D_MotionSensor1.xml";
var DEVICEFILE_SMOKE_SENSOR = "D_SmokeSensor1.xml";
var DEVICEFILE_LIGHT_SENSOR = "D_LightSensor1.xml";
var DEVICEFILE_IR_TRANSMITTER = "D_IrTransmitter1.xml";
var DEVICEFILE_WINDOW_COVERING = "D_WindowCovering1.xml";
var DEVICEFILE_GENERIC_IO = "D_GenericIO1.xml";
var DEVICEFILE_REMOTE_CONTROL = "D_RemoteControl1.xml";
var DEVICEFILE_COMBO_DEVICE = "D_ComboDevice1.xml";
var DEVICEFILE_CAMERA = "D_DigitalSecurityCamera1.xml";
var DEVICEFILE_SCENE_CONTROLLER = "D_SceneController1.xml";
var DEVICEFILE_SCENE_CONTR_LED = "D_SceneControllerLED1.xml";
var DEVICEFILE_ENERGY_CALCULATOR = "D_EnergyCalculator1.xml";
var DEVICEFILE_AV_MISC = "D_AvMisc1.xml";
var DEVICEFILE_TEMP_LEAK_SENSOR = "D_TemperatureLeakSensor1.xml";
var DEVICEFILE_AV_SCENE = "D_Scene1.xml";
var TEMPORARY_UPNP_ARGUMENT = "TEMPORARY_UPNP_ARGUMENT";
var HAGEVICE_FILE = "S_HomeAutomationGateway1.xml";
var HAGEVICE_SID = "urn:micasaverde-com:serviceId:HomeAutomationGateway1";
var HAGEVICE_STYPE = "urn:schemas-micasaverde-org:service:HomeAutomationGateway:1";
var HAG_ACTIVE_SCENES = "ActiveScenes";
var HAG_DATAVERSION_USERDATA = "DataVersionUserData";
var HAG_DATAVERSION_STATUS = "DataVersionStatus";
var HAG_ENERGY_DOW = "EnergyDOW";
var HAG_ENERGY_TIME_OF_DAY = "GetUserData";
var HAG_NUM_LIGHTS = "GetUserData";
var HAG_THERMOSTAT_ON = "GetUserData";
var HAG_ENERGY_DOW = "GetUserData";
var HAG_GET_USER_DATA = "GetUserData";
var HAG_MODIFY_USER_DATA = "ModifyUserData";
var HAG_MODIFY_GET_VARIABLE = "GetVariable";
var HAG_MODIFY_SET_VARIABLE = "SetVariable";
var HAG_MODIFY_GET_STATUS = "GetStatus";
var HAG_MODIFY_GET_ACTIONS = "GetActions";
var HAG_MODIFY_CREATE_DEVICE = "CreateDevice";
var HAG_MODIFY_DELETE_DEVICE = "DeleteDevice";
var HAG_MODIFY_CREATE_PLUGIN = "CreatePlugin";
var HAG_MODIFY_DELETE_PLUGIN = "DeletePlugin";
var HAG_MODIFY_CREATE_PLUGIN_DEVICE = "CreatePluginDevice";
var HAG_IMPORT_UPNP_DEVICE = "ImportUpnpDevice";
var HAG_PROCESS_CHILD = "ProcessChildDevices";
var HAG_RELOAD = "Reload";
var HAG_RUN_SCENE = "RunScene";
var HAG_RUN_LUA = "RunLua";
var HAG_LOG_IP_REQUEST = "LogIpRequest";
var HADEVICE_FILE = "S_HaDevice1.xml";
var HADEVICE_SID = "urn:micasaverde-com:serviceId:HaDevice1";
var HADEVICE_STYPE = "urn:schemas-micasaverde-com:service:HaDevice:1";
var HAD_ENERGY_LOG = "EnergyLog";
var HAD_IOPORT_DEVICE = "IODevice";
var HAD_IOPORT_DEVICE_XREF = "IODeviceXRef";
var HAD_IOPORT_MAX_TIME = "MaxTime";
var HAD_IOPORT_PORT = "IOPort";
var HAD_IGNORE_ROOM = "IgnoreRoom";
var HAD_COMM_FAILURE = "CommFailure";
var HAD_POLLING_ENABLED = "PollingEnabled";
var HAD_POLL_MIN_DELAY = "PollMinDelay";
var HAD_CONFIGURED = "Configured";
var HAD_JOBID = "JobID";
var HAD_REVERSE = "ReverseOnOff";
var HAD_LAST_UPDATE = "LastUpdate";
var HAD_AUTO_CONFIGURE = "AutoConfigure";
var HAD_LAST_TIME_CHECK = "LastTimeCheck";
var HAD_LAST_TIME_OFFSET = "LastTimeOffset";
var HAD_FIRST_CONFIGURED = "FirstConfigured";
var HAD_BATTERY_LEVEL = "BatteryLevel";
var HAD_BATTERY_DATE = "BatteryDate";
var HAD_BATTERY_ALARM = "BatteryAlarm";
var HAD_DOCUMENTATION = "Documentation";
var HAD_RECONFIGURE = "Reconfigure";
var HAD_REMOVE = "Remove";
var HAD_POLL = "Poll";
var HAD_SET_POLL_FREQUENCY = "SetPollFrequency";
var HAD_STRESS_TEST = "StressTest";
var HAD_TOGGLE_STATE = "ToggleState";
var ZWN_FILE = "S_ZWaveNetwork1.xml";
var ZWN_SID = "urn:micasaverde-com:serviceId:ZWaveNetwork1";
var ZWN_STYPE = "urn:schemas-micasaverde-org:service:ZWaveNetwork:1";
var ZWN_RESET_NETWORK = "ResetNetwork";
var ZWN_UPDATE_NETWORK = "UpdateNetwork"
var ZWN_UPDATE_NEIGHBORS = "UpdateNeighbors";
var ZWN_RECONFIGURE_ALL = "ReconfigureAllNodes";
var ZWN_REMOVE_NODES = "RemoveNodes";
var ZWN_ADD_NODES = "AddNodes";
var ZWN_DOWNLOAD = "DownloadNetwork";
var ZWN_PUT_BYTE = "PutByte";
var ZWN_HEAL_NETWORK = "HealNetwork";
var ZWN_SET_POLLING = "SetPolling";
var ZWN_SEND_DATA = "SendData";
var ZWN_POLL_ALL_NODES = "PollAllNodes";
var ZWN_SOFT_RESET = "SoftReset";
var ZWN_BACKUP_DONGLE = "BackupDongle";
var ZWN_SCENE_IDS = "SceneIDs";
var ZWN_LAST_UPDATE = "LastUpdate";
var ZWN_LAST_DONGLE_BACKUP = "LastDongleBackup";
var ZWN_NET_STATUS_ID = "NetStatusID";
var ZWN_NET_STATUS_TEXT = "NetStatusText";
var ZWN_USE_45 = "Use45";
var ZWN_USE_MR = "UseMR";
var ZWN_LIMIT_NEIGHBORS = "LimitNeighbors";
var ZWN_COM_PORT = "ComPort";
var ZWN_LOCK_COM_PORT = "LockComPort";
var ZWN_NODE_ID = "NodeID";
var ZWN_VERSION_INFO = "VersionInfo";
var ZWN_HOME_ID = "HomeID";
var ZWN_ROLE = "Role";
var ZWN_RESET_MODE = "ResetMode";
var ZWN_INCLUSION_MODE = "InclusionMode";
var ZWN_NODETYPE = "NodeType";
var ZWN_TIMEOUT = "Timeout";
var ZWN_MULTIPLE = "Multiple";
var ZWN_SIMULATE_INCOMING = "SimulateIncomingData";
var ZWN_POLL_ENABLED = "PollingEnabled";
var ZWN_POLL_DELAY_INITIAL = "PollDelayInitial";
var ZWN_POLL_DELAY_DEADTIME = "PollDelayDeadTime";
var ZWN_POLL_MINDELAY = "PollMinDelay";
var ZWN_POLL_FREQUENCY = "PollFrequency";
var ZWN_LAST_ERROR = "LastError";
var ZWN_DELAY_PROCESSING = "DelayProcessing";
var ZWDEVICE_FILE = "S_ZWaveDevice1.xml";
var ZWDEVICE_SID = "urn:micasaverde-com:serviceId:ZWaveDevice1";
var ZWDEVICE_STYPE = "urn:schemas-micasaverde-com:service:ZWaveDevice:1";
var ZWD_POLL_SETTINGS = "PollSettings";
var ZWD_MULTCH_ENDPOINT = "MultiChEndpoint";
var ZWD_MULTCH_CAPABIL = "MultiChCapabilities";
var ZWD_NEIGHBORS = "Neighbors";
var ZWD_CAPABILITIES = "Capabilities";
var ZWD_CONFIG = "Configuration";
var ZWD_LAST_RESET = "LastReset";
var ZWD_SCENES_AS_EVENTS = "ScenesAsEvents";
var ZWD_SCENES_TIMESTAMPS = "ScenesTimestamp";
var ZWD_WAKEUP_INTERVAL = "WakeupInterval";
var ZWD_LAST_WAKEUP = "LastWakeup";
var ZWD_LAST_ROUTE_UPD = "LastRouteUpdate";
var ZWD_VARIABLES_GET = "VariablesGet";
var ZWD_VARIABLES_SET = "VariablesSet";
var ZWD_ASSOCIATION_GET = "AssociationGet";
var ZWD_ASSOCIATION_SET = "AssociationSet";
var ZWD_ASSOCIATION_NUM = "AssociationNum";
var ZWD_NONCE_ACK = "NonceACK";
var ZWD_MANUF_INFO = "ManufacturerInfo";
var ZWD_VERSION_INFO = "VersionInfo";
var ZWD_NODE_INFO = "NodeInfo";
var ZWD_INITIAL_NAME = "InitialName";
var ZWD_CONFIGURED_NAME = "ConfiguredName";
var ZWD_CONFIGURED_VARIABLE = "ConfiguredVariable";
var ZWD_CONFIGURED_ASSOC = "ConfiguredAssoc";
var ZWD_SPECIAL_CONFIG_DONE = "SpecialConfigDone";
var ZWD_SPECIAL_ASSOC_DONE = "SpecialAssocDone";
var ZWD_DOCUMENTATION = "Documentation";
var ZWD_MANUAL_ROUTE = "ManualRoute";
var INN_FILE = "S_InsteonNetwork1.xml";
var INN_SID = "urn:micasaverde-com:serviceId:InsteonNetwork1";
var INN_STYPE = "urn:schemas-micasaverde-org:service:InsteonNetwork:1";
var INN_RESET_NETWORK = "ResetNetwork";
var INN_REMOVE_NODES = "RemoveNodes";
var INN_ADD_NODES = "AddNodes";
var INN_STOP_ADDREM_NODES = "StopAddRemoveNodes";
var INN_SEND_DATA = "SendData";
var INN_COM_PORT = "ComPort";
var INN_LOCK_COM_PORT = "LockComPort";
var INN_LAST_ERROR = "LastError";
var INN_LAST_UPDATE = "LastUpdate";
var INN_NET_STATUS_ID = "NetStatusID";
var INN_NET_STATUS_TEXT = "NetStatusText";
var INN_POLL_ENABLED = "PollingEnabled";
var INN_POLL_DELAY_INITIAL = "PollDelayInitial";
var INN_POLL_DELAY_DEADTIME = "PollDelayDeadTime";
var INN_POLL_MINDELAY = "PollMinDelay";
var INN_POLL_FREQUENCY = "PollFrequency";
var INN_NODE_ID = "NodeID";
var INN_SL_X10_CODE = "sl_X10Code";
var INN_VERSION_INFO = "VersionInfo";
var INN_HOME_ID = "HomeID";
var INN_ROLE = "Role";
var INN_RESET_MODE = "ResetMode";
var INN_INCLUSION_MODE = "InclusionMode";
var INN_NODETYPE = "NodeType";
var INN_TIMEOUT = "Timeout";
var INN_MULTIPLE = "Multiple";
var INN_SIMULATE_INCOMING = "SimulateIncomingData";
var INDEVICE_FILE = "S_InsteonDevice1.xml";
var INDEVICE_SID = "urn:micasaverde-com:serviceId:InsteonDevice1";
var INDEVICE_STYPE = "urn:schemas-micasaverde-com:service:InsteonDevice:1";
var IND_POLL_SETTINGS = "PollSettings";
var IND_MULTCH_ENDPOINT = "MultiChEndpoint";
var IND_MULTCH_CAPABIL = "MultiChCapabilities";
var IND_NEIGHBORS = "Neighbors";
var IND_CAPABILITIES = "Capabilities";
var IND_CONFIG = "Configuration";
var IND_LAST_RESET = "LastReset";
var IND_SCENES_AS_EVENTS = "ScenesAsEvents";
var IND_WAKEUP_INTERVAL = "WakeupInterval";
var IND_LAST_WAKEUP = "LastWakeup";
var IND_LAST_ROUTE_UPD = "LastRouteUpdate";
var IND_VARIABLES_GET = "VariablesGet";
var IND_VARIABLES_SET = "VariablesSet";
var IND_ASSOCIATION_GET = "AssociationGet";
var IND_ASSOCIATION_SET = "AssociationSet";
var IND_MANUF_INFO = "ManufacturerInfo";
var IND_VERSION_INFO = "VersionInfo";
var IND_UPDATED_NAME = "UpdatedName";
var UIRT_FILE = "S_USBUIRT.xml";
var UIRT_SID = "urn:micasaverde-com:serviceId:USBUIRT1";
var UIRT_TYPE = "urn:schemas-micasaverde-com:service:USBUIRT:1";
var UIRT_COM_PORT = "ComPort";
var CAMDEVICE_FILE = "S_Camera1.xml";
var CAMDEVICE_SID = "urn:micasaverde-com:serviceId:Camera1";
var CAMDEVICE_STYPE = "urn:schemas-micasaverde-com:service:Camera:1";
var CAM_USERNAME = "Username";
var CAM_PASSWORD = "Password";
var CAM_RELATED_SENSORS = "RelatedSensors";
var CAM_SENSOR_ARCHIVE_SEC = "SensorArchiveSeconds";
var CAM_RELATED_LIGHTS = "RelatedLights";
var CAM_LIGHT_OPTIONS = "LightOptions";
var CAM_AUTO_ARCH_SEC = "AutoArchiveSeconds";
var CAM_AUTO_PRES_DAYS = "AutoArchivePreserveDays";
var CAM_URL = "URL";
var CAM_DIRECT_URL = "DirectStreamingURL";
var PTZ_FILE = "S_PanTiltZoom1.xml";
var PTZ_SID = "urn:micasaverde-com:serviceId:PanTiltZoom1";
var PTZ_STYPE = "urn:schemas-micasaverde-com:service:PanTiltZoom:1";
var PTZ_LEFT = "MoveLeft";
var PTZ_RIGHT = "MoveRight";
var PTZ_UP = "MoveUp";
var PTZ_DOWN = "MoveDown";
var PTZ_IN = "ZoomIn";
var PTZ_OUT = "ZoomOut";
var SWP_SID = "urn:upnp-org:serviceId:SwitchPower1";
var SWP_SET_TARGET = "SetTarget";
var SWP_STATUS = "Status";
var SWP_TARGET = "Target";
var WC_SID = "urn:upnp-org:serviceId:WindowCovering1";
var WC_UP = "Up";
var WC_DOWN = "Down";
var WC_STOP = "Stop";
var WC_STATUS = "Status";
var WC_TARGET = "Target";
var SWD_SID = "urn:upnp-org:serviceId:Dimming1";
var SWD_SET_LOAD_LEVEL = "SetLoadLevelTarget";
var SWD_LOAD_LEVEL_STATUS = "LoadLevelStatus";
var SWD_LOAD_LEVEL_TARGET = "LoadLevelTarget";
var DL_SID = "urn:micasaverde-com:serviceId:DoorLock1";
var DL_SET_TARGET = "SetTarget";
var DL_SET_PIN = "SetPin";
var DL_CLEAR_PIN = "ClearPin";
var DL_SET_PIN_DATE = "SetPinValidityDate";
var DL_SET_PIN_WEEK = "SetPinValidityWeekly";
var DL_CLEAR_PIN_VALID = "ClearPinValidity";
var DL_STATUS = "Status";
var DL_TARGET = "Target";
var DL_SL_USER_CODE = "sl_UserCode";
var DL_SL_PIN_FAILED = "sl_PinFailed";
var DL_SL_LOCK_BUTTON = "sl_LockButton";
var DL_SL_LOCK_FAILURE = "sl_LockFailure";
var DL_SL_UNAUTH_USER = "sl_UnauthUser";
var DL_SL_LOW_BATTERY = "sl_LowBattery";
var DL_SL_VERY_LOW_BATTERY = "sl_VeryLowBattery";
var DL_PIN_CODES = "PinCodes";
var DL_NUM_SCHEDULES = "NumSchedules";
var HVACO_SID = "urn:upnp-org:serviceId:HVAC_UserOperatingMode1";
var HVACO_SET_MODE = "SetModeTarget";
var HVACO_STATUS = "ModeStatus";
var HVACS_SID = "urn:micasaverde-com:serviceId:HVAC_OperatingState1";
var HVACS_STATE = "ModeState";
var HVACF_SID = "urn:upnp-org:serviceId:HVAC_FanOperatingMode1";
var HVACF_SET_MODE = "SetMode";
var HVACF_STATUS = "Mode";
var HVACHEAT_SID = "urn:upnp-org:serviceId:TemperatureSetpoint1_Heat";
var HVACCOOL_SID = "urn:upnp-org:serviceId:TemperatureSetpoint1_Cool";
var HVACHC_SETPOINT = "SetCurrentSetpoint";
var HVACHC_CURRENTSP = "CurrentSetpoint";
var TEMP_SID = "urn:upnp-org:serviceId:TemperatureSensor1";
var TEMP_CURRENT = "CurrentTemperature";
var LIGHT_SID = "urn:micasaverde-com:serviceId:LightSensor1";
var LIGHT_CURRENT = "CurrentLevel";
var HUM_SID = "urn:micasaverde-com:serviceId:HumiditySensor1";
var HUM_CURRENT = "CurrentLevel";
var SES_SID = "urn:micasaverde-com:serviceId:SecuritySensor1";
var SES_ARMED = "Armed";
var SES_TRIPPED = "Tripped";
var SES_SET_ARMED = "SetArmed";
var ENE_SID = "urn:micasaverde-com:serviceId:EnergyMetering1";
var ENE_KWH = "KWH";
var ENE_WATTS = "Watts";
var ENE_ACTUAL = "ActualUsage";
var ENE_USER_SUPPLIED = "UserSuppliedWattage";
var IRT_SID = "urn:micasaverde-com:serviceId:IrTransmitter1";
var IRT_SENDPRONTO = "SendProntoCode";
var SPT_SID = "urn:micasaverde-org:serviceId:SerialPort1";
var SPT_PATH = "path";
var SPT_BAUD = "baud";
var SPT_VENDOR = "vendor";
var SPT_PRODUCT = "product";
var SCR_SID = "urn:micasaverde-com:serviceId:SceneController1";
var SCR_SL_SCENE_ACTIVATED = "sl_SceneActivated";
var SCR_SL_SCENE_DEACTIVATED = "sl_SceneDeactivated";
var SCR_SCENES = "Scenes";
var SCR_LAST_SCENE_ID = "LastSceneID";
var SCR_LAST_SCENE_TIME = "LastSceneTime";
var SCR_MANAGE_LEDS = "ManageLeds";
var SCR_NUM_BUTTONS = "NumButtons";
var SCR_FIRES_OFF_EVENTS = "FiresOffEvents";
var SCR_SCENE_SHORTCUTS = "SceneShortcuts";
var SCL_SID = "urn:micasaverde-com:serviceId:SceneControllerLED1";
var SCL_SET_LIGHT = "SetLight";
var SCL_LIGHT_SETTINGS = "LightSettings";
var GIO_SID = "urn:micasaverde-com:serviceId:GenericIO";
var GIO_IS_INPUT = "IsInput";
var GIO_DEFAULT_STATE = "DefaultState";
var ZWN_LAST_HEAL = "LastHeal";
var ZWD_HEALTH = "Health";
var ZWD_NEIGHBORS_INVERSE = "NeighborsInverse";
var IR_SID = "urn:micasaverde-com:serviceId:IrDevice1";
var IR_PROPRIETARY = "ProprietaryCodeset";

var ZWD_SCENES = "Scenes";
var CAM_PRE_ROLL_BUFFER = "PreRollBuffer";

// ************** end variables imported **********************

var DEVICE_CATEGORY_INTERFACE = 1;
var DEVICE_CATEGORY_DIMMABLE_LIGHT = 2;
var DEVICE_CATEGORY_SWITCH = 3;
var DEVICE_CATEGORY_SECURITY_SENSOR = 4;
var DEVICE_CATEGORY_HVAC =  5;
var DEVICE_CATEGORY_CAMERA = 6;
var DEVICE_CATEGORY_DOOR_LOCK = 7;
var DEVICE_CATEGORY_WINDOW_COV = 8;
var DEVICE_CATEGORY_REMOTE_CONTROL = 9;
var DEVICE_CATEGORY_IR_TX = 10;
var DEVICE_CATEGORY_GENERIC_IO = 11;
var DEVICE_CATEGORY_GENERIC_SENSOR=12;
var DEVICE_CATEGORY_SERIAL_PORT = 13;
var DEVICE_CATEGORY_SCENE_CONTROLLER=14;
var DEVICE_CATEGORY_AV = 15;
var DEVICE_CATEGORY_HUMIDITY = 16;
var DEVICE_CATEGORY_TEMPERATURE = 17;
var DEVICE_CATEGORY_LIGHT = 18;
var DEVICE_CATEGORY_ZWAVE_INT = 19;
var DEVICE_CATEGORY_INSTEON_INT = 20;
var DEVICE_CATEGORY_POWER_METER = 21;
var DEVICE_CATEGORY_ALARM_PANEL = 22;
var DEVICE_CATEGORY_ALARM_PARTITION = 23;

// need to be specified in constants.h
var SERVICE_TYPE_IR_TRANSMITTER='urn:schemas-micasaverde-com:service:IrTransmitter:1';
var SID_ALARM_PARTITION = 'urn:micasaverde-com:serviceId:AlarmPartition2';
var WC_STYPE='urn:schemas-upnp-org:service:WindowCovering:1';
var DEVICETYPE_ALARM_PARTITION='urn:schemas-micasaverde-com:device:AlarmPartition:1';
var ALARM_PARTITION_SID='urn:micasaverde-com:serviceId:AlarmPartition1';
var ALARM_PARTITION_ARMED='Armed';
var ALARM_PARTITION_STAYARMED='StayArmed';
var ALARM_PARTITION_DISARMED='Disarmed';
var ALARM_PARTITION_BREACH='Breach';
var api = {
	version: "UI7",
	ui: {
		updateDevice: function(deviceId,value,txt) 	{
			if (txt && txt.length>=2) {
				var device = MultiBox.getDeviceByID( _JSAPI_ctx.controllerid , deviceId);
				var name = txt.substring( txt.lastIndexOf('.')+1 );
				MultiBox.setAttr(device, "ip", value,null);
			}
		},
		startupShowModalLoading:  function() {	show_loading(); }
	},
	cloneObject: function (obj) {
		return cloneObject(obj);
	},
	getCommandURL: function() {
		return command_url;
	},
	getSendCommandURL: function() {
		return send_command_url;
	},
	getDataRequestURL: function() {
		return data_request_url;
	},
	getCpanelContent: function() {
		return "";
	},
	getListOfDevices: function () {
		return jsonp.ud.devices;
	},
	getCpanelDeviceId: function () {
		return _JSAPI_ctx.deviceid;
	},
	getCurrentHouseMode: function(onSuccess, onFailure, context) {
		MultiBox.getHouseMode( function (mode) {
			if (mode==null) {
				if (onFailure)
					(onFailure).call(context);
			}else {
				if (onSuccess)
					(onSuccess).call(context,mode);
			}
		});
	},
	setCurrentHouseMode: function(modeValue, onSuccess, onFailure, context) {
		MultiBox.setHouseMode(modeValue,function(mode) {
			if (mode==null) {
				if (onFailure)
					(onFailure).call(context);
			}else {
				if (onSuccess)
					(onSuccess).call(context,mode);
			}
		});
	},
	getDeviceIndex: function(deviceid) {
		var index  = null;
		$.each(jsonp.ud.devices, function(idx,elem) {
			if (elem.id==deviceid) {
				index = idx;
				return false;
			}
		});
		return index;
	},
	getDeviceObject: function(deviceid) {
		var obj   = null;
		$.each(jsonp.ud.devices, function(idx,elem) {
			if (elem.id==deviceid) {
				obj = elem;
				return false;
			}
		});
		return obj;
	},
	setCpanelContent: function (html) {
		set_panel_html(html);
	},
	getDeviceStateVariable: function (deviceId, service, variable, options) {
		return get_device_state(deviceId, service, variable, ( ( options && options.dynamic === true ) ? 1: 0));
	},
	getDeviceState: function (deviceId, service, variable, options) {
		return this.getDeviceStateVariable(deviceId, service, variable, options);
	},
	getDeviceTemplate: function(deviceId) {
		return false;
	},
	getDisplayedDeviceName: function(deviceId) {
		var device = this.getDeviceObject(deviceId);
		if (device && device.id!=0)
			return device.name;
		return 'unnamed device';
	},
	getEventDefinition: function(deviceType) {
		var _devicetypesDB = MultiBox.getDeviceTypesDB(_JSAPI_ctx.controllerid);
		var dt = _devicetypesDB[deviceType];	// is an associative array indexed by json name
		// UI7 api seems flawed as it assumes only one JSON file per device type
		// ALTUI will return a union of all
		var eventList2 = {};
		$.each(dt, function(idx,ui_static_data) {
			if (ui_static_data.eventList2 != undefined)
				eventList2 = $.extend(true,eventList2,ui_static_data.eventList2);
		});
		return eventList2;
	},
	setDeviceStateVariable: function (deviceId, service, variable, value, options) {
		set_device_state(deviceId, service, variable, value, (options && (options.dynamic === true)) ? 1: 0);
	},
	setDeviceAttribute: function(deviceId, attributeName, attributeValue, options) {
		var device = MultiBox.getDeviceByID( _JSAPI_ctx.controllerid, deviceId );
		MultiBox.setAttr( device, attributeName, attributeValue,function(result) {
			if ( options && $.isFunction(options.callback) )
				(options.callback)();
		});
	},
	setDeviceState:function(deviceId, service, variable, value, options) {
		return this.setDeviceStateVariable(deviceId, service, variable, value, options);
	},
	setDeviceStateVariablePersistent: function (deviceId, service, variable, value, options) {
		set_device_state(deviceId, service, variable, value, -1);
	},	
	setDeviceStatePersistent:function(deviceId, service, variable, value, options) {
		return this.setDeviceStateVariablePersistent(deviceId, service, variable, value, options);
	},
	getListOfSupportedEvents: function() {
		return EventBus.getEventSupported();
	},
	getLuSdata: function(onSuccess, onFailure, context) {
		var url = "data_request?id=sdata&output_format=json";
		var jqxhr = $.ajax( {
			url: url,
			type: "GET",
			dataType: "text",
			cache: false
		})
		.done(function(data, textStatus, jqXHR) {
			if ( $.isFunction( onSuccess ) )  {
				// jqXHR.status and jqXHR.responseText should exist and be populated
				// since the dataType is set to "text"
				var successData={responseText:jqXHR.responseText,status:jqXHR.status};
				(onSuccess).call(context, successData);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if ( $.isFunction( onFailure ) )  {
				var errorData={responseText:jqXHR.responseText,status:jqXHR.status}
				(onFailure).call(context, errorData );
			}
		})
		.always(function() {
		});
	},
	getSceneDescription: function(sceneId, options) {
		var scene = this.getSceneByID(sceneId);
		var clone = cloneObject(scene);
		if (options) {
			if (options.hideTriggers == true)
				delete clone["triggers"];
			if (options.hideSchedules == true)
				delete clone["timers"];
			if (options.hideActions == true)
				delete clone["groups"];
			// if (options.hideNotifications == true)
				// delete clone["???"];
		}
		return JSON.stringify(clone);
	},
	registerEventHandler: function(eventName, object, functionName) {
		EventBus.registerEventHandler(eventName, window, function( /*args*/ ) {
			//in API7 the parameters to the callback do not include the eventname
			//while in ALTUI the first parameter is the eventname. so here we have to remove it
			var theArgs = arguments;
			theArgs = [].slice.call(theArgs, 1);	// remove first argument which is eventname
			var func = object[functionName];
			func.apply( object , theArgs );
		});
	},
	performActionOnDevice: function(deviceId, service, action, options) {
		options = $.extend({ 
			actionArguments:{},
			onFailure:null,
			onSuccess:null,
			context:null
		},options);
		
		// return _upnpHelper.UPnPAction( deviceId, service, action, options.actionArguments, function(data, textStatus, jqXHR){
		var device = MultiBox.getDeviceByID( _JSAPI_ctx.controllerid, deviceId );
		return MultiBox.runAction(device, service, action, options.actionArguments,
			function(data, textStatus, jqXHR){
				if (data==null) {
					if (options.onFailure)
						(options.onFailure).call(options.context,{
							responseText: jqXHR.responseText,
							status: jqXHR.status
						});
				}
				else {
					if (options.onSuccess)
						(options.onSuccess).call(options.context,{
							responseText: data,
							status: jqXHR.status
						});
				}
			}
		);
	},
	performLuActionOnDevice: function(deviceId, service, action, options) {
		return this.performActionOnDevice(deviceId, service, action, options);
	},
	runUpnpCode: function(code, options, onSuccess, onFailure, context) {
		// return _upnpHelper.UPnPRunLua(code, function(data) {
		return MultiBox.runLua(_JSAPI_ctx.controllerid, code, function(data) {
			if (data==null) {
				if (onFailure)
					(onFailure).call(context,null);
			} else {
				if (onSuccess)
					(onSuccess).call(context,data);
			};
		});
	},
};