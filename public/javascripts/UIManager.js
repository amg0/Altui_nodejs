//# sourceURL=UIManager.js
// "use strict";

var Stack = (function(){
	var _stack=[];
	return {
		pop: function(func,args) { 
			return _stack.pop( {f:func, a:args} );
		},
		push: function(func,args) { 
			return _stack.push( {f:func, a:args} );
		}
	};
})();

var UIManager = (function(){
	function _preparePage() {
		$('main').empty();
	};
	function _onEditObject(type,id,callback) {
		DBModel.get(type,id,function(object) {
			var htmlid = 'createDialog';
			HtmlUtils.bodyFromObject(type,object,MODE_EDIT,function(htmlbody) {
				var htmlDialog = new EJS({url: '/views/defaultdialog.ejs'}).render({htmlid:htmlid, title:type, body: htmlbody});
				var dialog = DialogManager.registerDialog(htmlid,htmlDialog);
				DialogManager.runDialog(dialog,function(result) {
					var obj = HtmlUtils.objectFromBody(type,$(dialog));
					(callback)(obj);
				});
			});
		});
	};
	function _onCreateObject(type,callback) {
		var template = DBModel.getTemplate(type);
		var htmlid = 'createDialog';
		HtmlUtils.bodyFromObject(type,template,MODE_EDIT,function(htmlbody){
			var htmlDialog = new EJS({url: '/views/defaultdialog.ejs'}).render({htmlid:htmlid, title:type, body: htmlbody});
			var dialog = DialogManager.registerDialog(htmlid,htmlDialog);
			DialogManager.runDialog(dialog,function(result) {
				var obj = HtmlUtils.objectFromBody(type,$(dialog));
				(callback)(obj);
			});
		});
	};
	function _listPage(type,click_callback) {
		var htmlid = 'idtable';
		var commandtbl = [
		"<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"{0}\"><span class=\"fa fa-pencil fa-lg\"></span></button> ",
		"<button type=\"button\" class=\"btn btn-xs btn-danger command-delete \" data-row-id=\"{0}\"><span class=\"fa fa-trash-o fa-lg\"></span></button>"
		];
		function _commandFormatter(col,row) {
			return ($.map(commandtbl, function(e) { return e.format(row.id); })).join(" ");
		};
		
		function _updateList(type,htmlid,commandtbl) {
			var dictionary = DBModel.getDictionary(type);
			$.when(DBModel.getAll(type)).then(function(results) {
				// load the template file, then render it with data
				var html = new EJS({url: '/views/defaultlist.ejs'})
				.render({
					htmlid:htmlid, 
					title:'List: '+type, 
					data: results, 
					commandtbl:commandtbl});
					
				$('main').html(html);	

				// prepare formatters
				var formatters = {};
				$.each(dictionary, function (key,field_dict) {
					if (field_dict.formatter)
						formatters[key] = function(col,row) {
							return field_dict.formatter(col,row);
						};
				});
				
				// setup grid with commands and formatters
				var grid = $("#"+htmlid).bootgrid({
					caseSensitive:false,
					formatters: $.extend( formatters, {
						 "commands": _commandFormatter
					})
				})
				.on("click.rs.jquery.bootgrid", function(e,cols,row) {
					if ($.isFunction(click_callback))
						(click_callback)(row.id);
				})
				.on("loaded.rs.jquery.bootgrid", function() {
					/* Executes after data is loaded and rendered */
					grid.find(".command-edit").on("click", function(e)
					{
						var id = $(this).data('row-id');
						_onEditObject(type,id,function(object) {
							DBModel.update(type,object,function(result) {
								_updateList(type,htmlid,commandtbl);
							});
						});
						return false;	// prevent new handlers
					}).end().find(".command-delete").on("click", function(e)
					{
						var id = $(this).data('row-id');
						DBModel.del(type,id,function(result){
							_updateList(type,htmlid,commandtbl);
						});
						return false;	// prevent new handlers
					});
				});		
			});
		};

		_updateList(type,htmlid,commandtbl);		
		
		$('main')
			.off('click')
			.on('click','#mnow-create-object',function() {
				_onCreateObject(type,function(object){
					DBModel.add(type,object,function(result) {
						_updateList(type,htmlid,commandtbl);
					});
				})
				return false;	// prevent new handlers
			})	
	};
	function _searchPage(txt) {
		var _searchResults=[];
		var _deferreds =[];

		$.each(DBModel.getTypes() , function(idx,type) {
			var dictionary = DBModel.getDictionary(type);
			var filter=$.isFunction(dictionary.filter) ? [dictionary.filter(txt)] : null ;
			var cols=null;
			_deferreds.push(DBModel.getAll(type,filter,cols));
		});
		$.when.all(_deferreds).then(function(results) {
			$.each(DBModel.getTypes() , function(idx,type) {
				_searchResults.push({
					type: type,
					list : results[idx]
				});
			})
			var html = new EJS({url: '/views/search.ejs'}).render({
				title:"Search Results",
				results:_searchResults,
				commandtbl: null
			});
			$('main').html(html);		
		});
	};
	function _onePage(type,id) {	
		function _onClickCreate(othertype,callback) {
			_onCreateObject(othertype,function(object){
				DBModel.add(othertype,object,function(result) {
					if ($.isFunction(callback))
						(callback)();
				});
			});
		};
		function _onClickEdit(othertype,id,callback) {
			_onEditObject(othertype,id,function(object) {
				DBModel.update(othertype,object,function(result) {
					if ($.isFunction(callback))
						(callback)();
				})
			})
		};
		function _onClickDelete(othertype,id,callback) {
			DBModel.del(othertype,id,function(result) {
				if ($.isFunction(callback))
					(callback)();
			})
		};
		function _onClickGoto(type,id,callback) {
			_onePage(type,id);
		};
		
		// var deferred = [];
		// deferred.push(DBModel.get(type,id).done(obj) { _obj = obj; } );

		$.when(DBModel.get(type,id))
		.done( function(object) {
			$.when(HtmlUtils.bodyFromObject(type,object,MODE_VIEW))
			.done( function(fieldvalues) {
				var viewmodel = {
					title:DBModel.name( type,object ) || type,
					type: type,
					object:object,
					resolved_object:fieldvalues
				};
				// prepare list of all remote references
				var remote_ref = DBModel.getRemoteReferences(type);
				var deferreds = [];
				$.each(remote_ref, function(remotetype,info) {
					// find all objects which remote ref value is equal to "id"
					// info = {field:fieldname, fieldkey: fielddescr.field}
					
					// find remote objects corresponding to this one
					var filter = ['{0}=\'{1}\''.format(info.remotefield,object[info.localfield])];
					
					// filter out the columns remotefield
					var remotedict = DBModel.getDictionary(remotetype);
					var cols = Object.keys(remotedict).filter( function(key) { return (typeof(remotedict[key])!="function") && (key!=info.remotefield)} );
					deferreds.push( 
						DBModel.getAll(remotetype,filter,cols).then(function(list) {
							remote_ref[remotetype].result = list;
						})
					);
				});
				$.when.all(deferreds).then(function(results) {
					// render view
					// prepare buttons in main object panel
					//
					var buttons = [
						{ group: "",
						  buttons:[	// first group
								{class:'mnow-edit-btn', id:type, glyph:'glyphicon-pencil', label:'Edit', callback:_onClickEdit, params:[type,id] }
							]	
						}
					];
					//
					// for each reference object create a button to goto this object
					//
					var dictionary = DBModel.getDictionary(type);
					$.each(dictionary, function (key,field_dict) {
						if ((field_dict.type == "reference") && (object[key]!=null) ){
							buttons[0].buttons.push(
								{class:'mnow-goto-btn', id:field_dict.table.toString()+'_'+buttons[0].buttons.length, glyph:'glyphicon-arrow-right', label:fieldvalues[key], callback:_onClickGoto, params:[field_dict.table,object[key]] }
							);
						};
					});
					var commandtbl = [
					"<button type=\"button\" class=\"btn btn-xs btn-default command-goto\" data-row-id=\"{0}\"><span class=\"glyphicon glyphicon-triangle-right\"></span></button> ",
					"<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"{0}\"><span class=\"fa fa-pencil fa-lg\"></span></button> ",
					"<button type=\"button\" class=\"btn btn-xs btn-danger command-delete \" data-row-id=\"{0}\"><span class=\"fa fa-trash-o fa-lg\"></span></button>"
					];
					function _commandFormatter(col,row) {
						return ($.map(commandtbl, function(e) { return e.format(row.id); })).join(" ");
					};

					viewmodel.references={};
					$.each(remote_ref, function(remotetype,info) {
						viewmodel.references[remotetype]= { 
							remotefield:info.remotefield,
							html:HtmlUtils.array2Table(
								'{0}-{1}'.format(remotetype,info.remotefield),		//htmlid 
								info.result,
								'id',
								null,
								commandtbl)
						};
						buttons.push( {
							group: remotetype,
							buttons: [
								{class:'mnow-create-btn', id:remotetype, glyph:'glyphicon-plus', label:'Create', callback:_onClickCreate, params:[remotetype] }
							]
						});
					});
					// viewmodel.references = remote_ref;
					viewmodel.buttons = buttons;
					var html = new EJS({url: '/views/viewobject.ejs'}).render(viewmodel);
					$('main').html(html);	
					
					// buttons
					$.each(viewmodel.buttons, function(i,group) {
						$.each(group.buttons,function(j,btn) {
							$("."+btn.class+"#"+btn.id).click( function() { 
								btn.params.push( function() {
									_onePage(type,id);
								} );
								(btn.callback).apply( this, btn.params );
							} );
						});
					});
					//bootgridify
					$.each(remote_ref, function(remotetype,info) {
						var grid = $("#"+'{0}-{1}'.format(remotetype,info.remotefield)).bootgrid({
							caseSensitive:false,
							formatters: {
								 "commands": _commandFormatter
							}
						}).on("loaded.rs.jquery.bootgrid", function() {
							/* Executes after data is loaded and rendered */
							grid.find(".command-edit").on("click", function(e)
							{
								var remoteid = $(this).data('row-id');
								_onClickEdit(remotetype,remoteid,function() {
									_onePage(type,id);
								});
								return false;	// prevent new handlers
							}).end().find(".command-delete").on("click", function(e)
							{
								var remoteid = $(this).data('row-id');
								_onClickDelete(remotetype,remoteid,function() {
									_onePage(type,id);
								});
								return false;	// prevent new handlers
							}).end().find(".command-goto").on("click", function(e)
							{
								var remoteid = $(this).data('row-id');
								_onePage(remotetype,remoteid );
								return false;	// prevent new handlers
							}).end()
						}).on("click.rs.jquery.bootgrid", function(e,cols,row) {
							_onePage(remotetype,row.id);
						})		
					});
				});
			});
		});
	};
	return {
		pageProjects: function() {
			Stack.push(UIManager.pageProjects,arguments);
			_preparePage();
			_listPage('projects',UIManager.pageProject);
		},
		pageProject: function(id) {
			Stack.push(UIManager.pageProject,arguments);
			_preparePage();
			_onePage('projects',id);
		},
		pageMilestones: function() {
			Stack.push(UIManager.pageMilestones,arguments);
			_preparePage();
			_listPage('milestones',UIManager.pageMilestone);
		},
		pageMilestone: function(id) {
			Stack.push(UIManager.pageMilestone,arguments);
			_preparePage();
			_onePage('milestones',id);
		},
		pageUsers: function() {
			Stack.push(UIManager.pageUsers,arguments);
			_preparePage();
			_listPage('users',UIManager.pageUser);
		},
		pageUser: function(id) {
			Stack.push(UIManager.pageUser,arguments);
			_preparePage();
			_onePage('users',id);			
		},
		pageSearch: function() {
			var txt = $("#mnow-search-text").val();
			_preparePage();
			_searchPage(txt);
			return false;
		}
	};
})();

$(document).ready(function() {
	$( document )
		.on ("click", "#mnow-page-projects", UIManager.pageProjects )
		.on ("click", "#mnow-page-users", UIManager.pageUsers )
		.on ("click", "#mnow-page-milestones", UIManager.pageMilestones )		
		.on ("click", "#mnow-search-submit", UIManager.pageSearch )
});