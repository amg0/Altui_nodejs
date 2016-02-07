//# sourceURL=Utils.js
// "use strict";

var MODE_VIEW = 'view';
var MODE_EDIT = 'edit';

if (typeof Array.prototype.clone == 'undefined') {
	Array.prototype.clone = function() {
		return this.slice(0);
	};
};

if (typeof String.prototype.format == 'undefined') {
	String.prototype.format = function()
	{
		var args = new Array(arguments.length);
		for (var i = 0; i < args.length; ++i) {
		// `i` is always valid index in the arguments object
		// so we merely retrieve the value
		args[i] = arguments[i];
		}
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
};

// Put somewhere in your scripting environment
if (jQuery.when.all===undefined) {
    jQuery.when.all = function(deferreds) {
		var deferred = new jQuery.Deferred();
		var len = deferreds.length;
		if (len==0)
			deferred.resolve([]);
		else {
			$.when.apply(jQuery, deferreds)
			.then(
				function() {
					var result = [];
					result = Array.prototype.slice.call(arguments);
					deferred.resolve(result);
				},
				function() {
					var result = [];
					result = Array.prototype.slice.call(arguments);
					deferred.fail(result);
				}
			);
		}
		return deferred.promise();
    }
}

var HtmlUtils = (function() {
	function _buildField(mode,dictionary,key,value) {
		var dfd =  $.Deferred();
		var htmlField = {};
		switch (dictionary.type) {
			case "number":
				htmltype="number";
				if (mode==MODE_VIEW)
					htmlField[key]=value;
				else
					htmlField = new EJS({url: '/views/ff_input.ejs'}).render({
						htmltype:"number",
						key:key,
						value:value,
						required:(dictionary.required || false), 
						placeholder:""
					});
				dfd.resolve(htmlField);
				break;
			case "date":
				// for pure date field, we do not want to take into account user locale. date is the date we want
				value = value.substring(0, 10);
				// var date = new Date(value);
				// value = date.toISOString().substring(0, 10);
				if (mode==MODE_VIEW)
					htmlField[key]=value;
				else
					htmlField = new EJS({url: '/views/ff_input.ejs'}).render({
						htmltype:"date",
						key:key,
						value:value,
						required:(dictionary.required || false), 
						placeholder:"YYYY-MM-DD"
					});
				dfd.resolve(htmlField);
				break;
			case "enum":
				if (mode==MODE_VIEW)
					htmlField[key]=value;
				else {
					var items = $.map(dictionary.values, function(value) { 
						// table for values we need
						// properties of <option>
						return {
							id:value, 
							label:value
						} 
					});
					htmlField = new EJS({url: '/views/ff_select.ejs'}).render({
						key:key,
						value:value,	// this object id is the selected value
						items:items,	// this is the <options>		
						required: (dictionary.required==true)
					});
				}
				dfd.resolve(htmlField);
				break;
			case "reference":
				//{type:'reference', default:null, table:'users', field:'id', formatter:function(r) {}}
				if (mode==MODE_VIEW) {
					$.when(DBModel.get( dictionary.table , value))
					.done(function(obj) {
						htmlField[key]=DBModel.name(dictionary.table,obj);
						dfd.resolve(htmlField);
					});
				}
				else {
					DBModel.getAll( dictionary.table )
					.then(function(data) {
						var dummyrow={}
						var items = $.map(data, function(elem) { 
							// table for values we need
							// properties of <option>
							dummyrow[key]=elem[ dictionary.field ];
							return {
								id:elem[ dictionary.field ], 
								label:dictionary.formatter(key,dummyrow)
								} 
							});
						htmlField = new EJS({url: '/views/ff_select.ejs'}).render({
							key:key,
							value:value,	// this object id is the selected value
							items:items,	// this is the <options>		
							required: (dictionary.required==true)
						});
						dfd.resolve(htmlField);
					});
				}
				break;
			default:
				if (mode==MODE_VIEW)
					htmlField[key]=value;
				else
					htmlField = new EJS({url: '/views/ff_input.ejs'}).render({
						htmltype:dictionary.type,
						key:key,
						value:value,
						required:(dictionary.required || false), 
						placeholder:""
					});
				dfd.resolve(htmlField);
		}
		return dfd.promise();
	}
	return {
		bodyFromObject : function ( type, template, mode, callback ) {
			var dfd =  $.Deferred();
			var html="";
			var dictionary = DBModel.getDictionary(type);
			var deferreds = [];
			var that = template;
			$.each(template, function(key,value) {
				deferreds.push( _buildField(mode,dictionary[key],key,value) );
			});
			$.when.all(deferreds).then(function(results) {
				var ret ={};
				if (mode==MODE_VIEW) {
					$.each(results,function(i,r) { ret = $.extend(ret,r) });
				} else {
					ret = results.join("")
				}
				if ($.isFunction(callback))
					(callback)(ret);	// html mode pure concat of strings
				dfd.resolve(ret);
			});
			return dfd.promise();
		},
		objectFromBody : function (type, dialog) {
			var obj= DBModel.getTemplate(type);
			var dictionary = DBModel.getDictionary(type);
			var inputs = $(dialog).find("input");
			inputs.each(function(idx,elem) {
				var key = $(elem).prop('id');
				var value = $(elem).val();
				if ( (dictionary[key].required == true) || (value!="") ) {
					switch (dictionary[key].type) {
						case "date":
							obj[key]=value;
							break;
						default:
							obj[key]=value;					
					}
				}
			});
			var selects = $(dialog).find("select");
			selects.each(function(idx,elem) {
				var key = $(elem).prop('id');
				var value = $(elem).val();
				if (value=="0")
					value=null;
				obj[key]=value;
			});
			return obj;
		},
		array2Table : function (htmlid, arr,idcolumn,viscols,commands) {
			var commands = $.extend([],commands);
			var html="";
			var idcolumn = idcolumn || 'id';
			var viscols = viscols || [idcolumn];
			if ( (arr) && ($.isArray(arr) && (arr.length>0)) ) {
				var bFirst=true;
				html+="<table id='{0}' class='table table-condensed table-hover table-striped'>".format(htmlid);
				$.each(arr, function(idx,obj) {
					if (bFirst) {
						html+="<thead>"
						html+="<tr>"
						$.each(obj, function(k,v) {
							html+="<th data-column-id='{0}' data-formatter='{0}' {1} {2}>".format(
								k,
								(k==idcolumn) ? "data-identifier='true'" : "",
								"data-visible='{0}'".format( true /*$.inArray(k,viscols)!=-1*/ )
							)
							html+=k;
							html+="</th>"
						});
						if (commands.length>0)
							html += "<th data-column-id='commands' data-formatter='commands' data-sortable='false'>Commands</th>"
						html+="</tr>"
						html+="</thead>"
						html+="<tbody>"
						bFirst=false;
					}
					html+="<tr>"
					$.each(obj, function(k,v) {
						html+="<td>"
						html+=( (v==null) ? '' : v)
						html+="</td>"
					});
					if (commands.length>0) {
						html+="<td></td>";
					}
					html+="</tr>"
				});
				html+="</tbody>"
				html+="</table>";		
			}
			return html;
		}
	}
})();
