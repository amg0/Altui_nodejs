//# sourceURL=DBModel.js
// "use strict";
	
var DBModel = (function() {
	var _dictionary = {
		"projects":{
			"id": 				{type:'number', default:''},
			"project_name":		{type:'text', 	default:'' , required:true },
			"prod_date":		{type:'date', 	default:new Date().toISOString().substring(0, 10) , required:true },
			"project_manager":	{type:'reference', default:null, table:'users', field:'id', formatter:function(col,row) { 
					// if not null
					if (row.project_manager) {
						var usr = Cache.get("users",row.project_manager);
						return '{0},{1}'.format(usr.last_name,usr.first_name);
					}
					return "";
				}
			},
			shortname: function(obj) { return obj.project_name },
			filter: function(txt) 	 { return 'project_name LIKE \'%{0}%\''.format(txt) }
		},
		"users":{
			"id": 			{type:'number', default:''},
			"first_name":	{type:'text', 	default:''},
			"last_name":	{type:'text', 	default:'' , required:true },
			"email":		{type:'email', 	default:'' , required:true },
			"location":		{type:'text', 	default:''},
			shortname: 		function(obj) { return '{0}, {1}'.format(obj.last_name, obj.first_name) },
			filter: 		function(txt) { return '(last_name LIKE \'%{0}%\') OR (first_name LIKE \'%{0}%\') OR (location LIKE \'%{0}%\')'.format(txt) }
		},
		"milestones":{
			"id": 			{type:'number', default:''},
			"kind": 		{type:'enum',  values:['MTP', 'CAT', 'INT', 'DEV'], default:'MTP' , required:true },
			"subkind": 		{type:'text',  default:''  },
			"date": 		{type:'date', default:new Date().toISOString().substring(0, 10) , required:true },
			"project": 		{type:'reference', default:null, table:'projects', field:'id', required:true, formatter:function(col,row) { 
								// if not null
					if (row.project) {
						var pro = Cache.get("projects",row.project);
						return '{0}'.format(pro.project_name);
					}
					return "";
				}
			},
			shortname: 		function(obj) { return '{0}-{1}'.format(obj.kind, obj.date) },
			filter: 		function(txt) { return '(kind LIKE \'%{0}%\') OR (subkind LIKE \'%{0}%\')'.format(txt) }
		}
	};
	
	var Cache = (function() {	
		var _cache={};
		
		function _init() { delete _cache; _cache={} };
		function _load(type,list) {
			_cache[type]=list;
		};
		
		function _add(type,obj) {
			if (obj) {
				if (_cache[type]==null)
					_cache[type]=[]
				_cache[type].push(obj);
			}
			return obj;
		}
		function _get(type,id) {
			if ((id>0) && (_cache[type]) ) {
				for (var i=0; i<_cache[type].length ; i++) {
					if (_cache[type][i].id == id ) {
						return _cache[type][i];
					}
				}
			}
			return null;
		}
		return {
			init	: _init,
			load	: _load,
			add		: _add,
			get		: _get
		};
	})();
	
	function _getAll(objtype,filters,columns,callback) {
		// filters = ["id=1","project_name='Biztalk Migration'"];	 DEBUG
		var data={filters: filters, columns:columns};
		// if (columns)
			// data.columns = columns.join(",");
		return $.ajax({
		  url: '/api/'+objtype,
		  dataType: "json",
		  data:data,
		  cache:false,
		  success: function (data) {
			if ($.isFunction(callback))
				callback(data);
		  }
		});
	};
	
	return {
		getTypes: function() {
			return Object.keys(_dictionary);
		},
		
		getDictionary:function(type) {
			return _dictionary[type] || null;
		},
		
		getTemplate:function(type) {
			var dict = _dictionary[type];
			if (dict) {
				var obj = {};
				$.each(dict,function(k,v) {
					if ( (typeof(v)!="function") )
						obj[k]=v.default;
				});
				return obj;
			}
			return null;
		},
		
		getRemoteReferences:function(objtype){
			var results={};
			// search all objects which point to this one
			$.each(_dictionary,function(key, dict) {
				if (key != objtype) {
					$.each(dict, function(fieldname, fielddescr) {
						if ((fielddescr.type =="reference") && (fielddescr.table==objtype)){
							results[key] = {remotefield:fieldname, localfield: fielddescr.field}
						}
					})
				}
			});
			return results;
		},
		
		name:function(objtype, obj) {
			if (obj==null)
				return '';
			var dictionary = DBModel.getDictionary(objtype);
			return dictionary.shortname( obj );

		},
		
		getAll:function(objtype, filters, columns, callback ) {
			// filters = $.extend([],filters);
			var dfd = new jQuery.Deferred();
			var dictionary = DBModel.getDictionary(objtype);
			var keys = Object.keys(dictionary);
			Cache.init();
			$.when(_getAll(objtype,filters,columns))
			.done(function(list) {
				var deferreds = [ ];
				Cache.load(objtype,list);	// add the result in the cache
				$.each(list,function(i,row) {
					var references = keys.filter(function(key) { return dictionary[key].type=="reference"})
					$.each( references, function (i,key) {
						//type:'reference', default:null, table:'users', field:'id', formatter:function(col,row)
						var dictline = dictionary[key];
						if (row[key]!=null) {
							deferreds.push( DBModel.get(dictline.table, row[key]) 
								.done(function(refobj){
									Cache.add(dictline.table,refobj);
								})
							);
						}
					});
				})
				$.when.all(deferreds).then(function(results) {
					if ($.isFunction(callback))
						(callback)(list.clone());
					dfd.resolve(list.clone())
				})
			});
			return dfd.promise();
		},
		
		get:function(objtype, id, callback ) {
			if (id) {
				return $.ajax({
				  url: '/api/'+objtype+'/'+id.toString(),
				  type: 'GET',
				  cache:false,
				  success: function (data) {
					  if ($.isFunction(callback))
						callback(data);
				  }
				});
			}
			return null;
		},

		update:function(objtype, object, callback ) {
			if (object.id) {
				return $.ajax({
				  url: '/api/'+objtype+'/'+object.id.toString(),
				  type: 'PUT',
				  data: {
					  json:JSON.stringify(object)
				  },
				  cache:false,
				  success: function (data) {
					  if ($.isFunction(callback))
						callback(data);
				  }
				});
			}
			return null;
		},
		
		add:function(objtype, object, callback ) {
			return $.ajax({
			  url: '/api/'+objtype,
			  type: 'POST',
			  data: {
				json:JSON.stringify(object)
			  },
			  cache:false,
			  success: function (data) {
				  if ($.isFunction(callback))
					callback(data);
			  }
			});
		},
		
		del:function(objtype, id, callback ) {
			return $.ajax({
			  url: '/api/'+objtype+'/'+id.toString(),
			  type: 'DELETE',
			  data: null,
			  cache:false,
			  success: function (data) {
				  if ($.isFunction(callback))
					callback(data);
			  }
			});
		}
	}
})();
