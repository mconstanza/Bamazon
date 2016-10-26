// Imports ///////////////////////////////////////////////////////////////////////////////////////////////////
var mysql = require('mysql');
var connection = require('./connection.js');

var table = require('text-table');

var prompt = require('prompt');
var inquirer = require('inquirer');

// Functions ////////////////////////////////////////////////////////////////////////////////////////////////

function displayProducts() {

	// query the database
	connection.query('select * from products', function(err, res) {

		// Display Item ID, product name, and price of each item in the database
		var dataToDisplay = [["\nID", "Name", "Price"], ['==','====================================================','==========']];


		// loop through the results of the database query and display items in a table
		for (i = 0; i < res.length; i++){

			var row = [];
			var item = res[i];

			row.push(item.ItemID, item.ProductName, item.Price)

			dataToDisplay.push(row)
		};

		var display = table( dataToDisplay, {hsep:' | '})

		console.log(display);
		console.log('\n')

		// prompt the customer to place an order
		orderPrompt();

	});
};

function newOrderPrompt() {

	inquirer.prompt(
	{
		'type': 'confirm',
		'message': 'Would you like to place another order?',
		'name': "newOrder"
	}).then(function(answers){

		if (answers.newOrder == true) {
			displayProducts();
		}else {
			process.exit();
		}
	})
};

function orderPrompt() {
	prompt.start();

	prompt.get(['ProductID', 'Quantity'], function(err, res) {

		var id = res.ProductID;
		var quantity = parseFloat(res.Quantity);

		connection.query('select * from products where ItemID = ?', [id], function(err, res) {

			var item = res[0];

			// if the check stock function returns false (that there is no remaining stock)
			if (checkStock(item, quantity) == false) {

				console.log("Sorry, but there isn't enough stock left of that item to complete your order.")

				orderPrompt();

			// if there is enough stock remaining
			}else{

				placeOrder(item, quantity);

			}
		});
	});
};

function checkStock(item, orderQuantity) {

	// not in stock
	if (item.StockQuantity - orderQuantity < 0) {return false}
	// in stock
	else { return true}
};

function placeOrder(item, orderQuantity) {


	connection.query('update products set StockQuantity=? where ItemID = ?', [item.StockQuantity - orderQuantity, item.ItemID], function(err, res){

		var price = orderQuantity * item.Price;

		updateDepartmentSales(price, item.DepartmentName);

		console.log('Your order of ' + orderQuantity + ' ' + item.ProductName + ' has been placed. Your total will be $' + price +'. Thank you!' )

		newOrderPrompt();
	})
};

function updateDepartmentSales(sales, department) {

	var query = 'update departments set TotalSales=TotalSales+? where DepartmentName=?';
	var parameters = [sales, department];

	connection.query(query, parameters, function(err, res) {

		if (err){console.log(err)}
	})

}

// Run the program ////////////////////////////////////////////////////////////////////////////////////////

// connect to the database
connection.connect(function(err) {
	if (err) throw err;
	// console.log("connected as id " + connection.threadId);
})

displayProducts();

