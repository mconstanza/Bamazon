var mysql = require('mysql');
var connection = require('./connection.js');

var table = require('text-table')


connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
})


// initial query to display products
connection.query('select * from products', function(err, res) {

	console.log(res)

	var dataToDisplay = [["\nName", "Department", "Price", "Quantity"]];


	for (i = 0; i < res.length; i++){
		// console.log("Product: " + res[i].ProductName + ' | ' + "Department: " + res[i].DepartmentName + ' | ' + 
		// 	'Price: $' + res[i].price + ' | ' + 'Quantity: ' + res[i].StockQuantity + ' | ' )
		// console.log("\n====================================================================================================\n")
		var row = [];

		row.push(res[i].ProductName, res[i].DepartmentName, res[i].price, res[i].StockQuantity)

		dataToDisplay.push(row)

		console.log(dataToDisplay)
	};

	var display = table( dataToDisplay, {hsep:' | '})

	console.log(display);

})