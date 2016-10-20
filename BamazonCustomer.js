var mysql = require('mysql');
var connection = require('./connection.js');


connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
})