//# sourceURL=genericdal.js
// "use strict";
var winston = require("winston");	// logging functionality
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
var mysql = require("mysql");		// mysql access

module.exports = function(tablename) {
	var _tablename = tablename;
	winston.info('init generic DAL for "%s" ',_tablename);
	return {
		listAll : function(con,fields,filters,callback) {
			var filterstr = "";
			var sql = 'SELECT * FROM '+_tablename;
			if (fields && fields.length>0)
				sql = mysql.format('SELECT ?? FROM '+_tablename, [fields]);

			if (filters && filters.length>0) {
				filterstr = "(" + filters.join(") AND (") + ")";
				sql = sql + " WHERE " + filterstr;
			}

			winston.info('listAll SQL:%s',sql);
			con.query(sql, function(error, results, fields){
				if (error) winston.error(error);
				(callback)(error, results, fields);
			});					
		},
		get : function( con,object , callback ) {
			var sql = mysql.format('SELECT * FROM '+_tablename+' WHERE id=? LIMIT 1',[object.id]);
			winston.info('get SQL:%s',sql);
			con.query(sql, function(error, results, fields){
			  if (error) winston.error(error);
			  if (results.length==0) {
				  var err = new Error("No record found");
				  winston.log('warn',err);
				  (callback)(err, {}, fields);
			  }
			  else
				  (callback)(error, results[0], fields);
			});					
		},
		add : function( con,object , callback ) {
			delete object.id;
			var sql = mysql.format('INSERT INTO '+_tablename+' SET ?',object);
			winston.info('add SQL:%s',sql);
			con.query(sql, function(error, results, fields){
			  if (error) winston.error(error);
			  // winston.info(results);
			  (callback)(error, results, fields);
			});	
		},
		update : function( con, id, object, callback  ) {
			delete object.id;
			var sql = mysql.format('UPDATE '+_tablename+' SET ? Where ID = ?',[object,id]);
			// winston.info(object);
			winston.info('update SQL:%s',sql);
			con.query(
			  sql,
			  function (error, results, fields) {
				if (error) winston.error(error);
				// winston.info('Changed ' + results.changedRows + ' rows');
				if (results.changedRows==0) {
					var err = new Error("No record found or modified");
					winston.log('warn',err);
					(callback)(err, results, fields);
				}
				else
					(callback)(error,results, fields);
			  }
			);
		},
		remove : function( con, id, callback ) {
			var sql = mysql.format('DELETE FROM '+_tablename+' WHERE id = ?',[id]);
			winston.info('delete SQL:%s',sql);
			con.query(
			  sql,
			  function (error,results, fields) {
				if (error) winston.error(error);
				winston.info('Deleted ' + results.affectedRows + ' rows');
				if (results.affectedRows==0) {
					var err = new Error("No record deleted");
					winston.log('warn',err);	
					(callback)(err,results, fields);					
				}
				else
					(callback)(error,results, fields);
			  }
			);
		}
	};
};