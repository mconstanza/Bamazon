// Imports ///////////////////////////////////////////////////////////////////////////////////////////////////
var mysql = require('mysql');
var connection = require('./connection.js');

var table = require('text-table');

var prompt = require('prompt');
var inquirer = require('inquirer');

// Functions /////////////////////////////////////////////////////////////////////////////////////////////////

function mainPrompt() {
	inquirer.prompt(
	{
		'type': 'list',
		'message': 'What would you like to do today, sir?',
		'choices': ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
		'name': 'choice'
	}).then(function(answers){

		switch (answers.choice) {
			case 'View Products for Sale':

				viewProductsForSale();
				break;

			case 'View Low Inventory':

				viewLowInventory();
				break;

			case 'Add to Inventory':
				addToInventory();
				break;

			case 'Add New Product':
				addNewProduct();
				break;

			case 'Exit':
				process.exit();
		}
	})
};

function displayProducts(callback) {
	// query the database
	connection.query('select * from products', function(err, res) {

		// Display Item ID, product name, and price of each item in the database
		var dataToDisplay = [["\nID", "Name", "Department", "Price", 'Stock'], ['==','====================================================', '===========================', '==========', '======']];


		// loop through the results of the database query and display items in a table
		for (i = 0; i < res.length; i++){

			var row = [];
			var item = res[i];

			row.push(item.ItemID, item.ProductName, item.DepartmentName, item.Price, item.StockQuantity)

			dataToDisplay.push(row)
		};

		var display = table( dataToDisplay, {hsep:' | '})

		console.log(display);
		console.log('\n')

		callback();
	});
};

function viewProductsForSale() {

	// query the database
	connection.query('select * from products', function(err, res) {

		// Display Item ID, product name, and price of each item in the database
		var dataToDisplay = [["\nID", "Name", "Department", "Price", 'Stock'], ['==','====================================================', '===========================', '==========', '======']];


		// loop through the results of the database query and display items in a table
		for (i = 0; i < res.length; i++){

			var row = [];
			var item = res[i];

			row.push(item.ItemID, item.ProductName, item.DepartmentName, item.Price, item.StockQuantity)

			dataToDisplay.push(row)
		};

		var display = table( dataToDisplay, {hsep:' | '})

		console.log(display);
		console.log('\n')

		mainPrompt();
	});
};

function viewLowInventory() {
	// query the database
	connection.query('select * from products where StockQuantity < 5', function(err, res) {

		// Display Item ID, product name, and price of each item in the database
		var dataToDisplay = [["\nID", "Name", "Department", "Price", 'Stock'], ['==','====================================================', '===========================', '==========', '======']];


		// loop through the results of the database query and display items in a table
		for (i = 0; i < res.length; i++){

			var row = [];
			var item = res[i];

			row.push(item.ItemID, item.ProductName, item.DepartmentName, item.Price, item.StockQuantity)

			dataToDisplay.push(row)
		};

		var display = table( dataToDisplay, {hsep:' | '})

		console.log(display);
		console.log('\n')

		mainPrompt();

	});
};

function addToInventory() {

	displayProducts(addToInventoryPrompt);	
};

function addToInventoryPrompt() {
	prompt.start();

	prompt.get(['ID', 'Quantity'], function(err, res) {
		var id = res.ID;
		var quantity = res.Quantity;

		connection.query('update products set StockQuantity = StockQuantity + ? where ItemID =?',[quantity, id], function(err, res) {

			console.log('Stock updated.')

			viewProductsForSale();
		})
	})
};

function addNewProduct() {
	prompt.start();

	prompt.get(['Name','Department', 'Price', 'Quantity'], function(err, res) {
		var product = res;

		connection.query('insert into products (ProductName,DepartmentName,Price, StockQuantity) values (?,?,?,?);',[product.Name, product.Department, product.Price, product.Quantity], function(err, res) {
			if (err){
				console.log(err)
			}
			else{
				console.log('Stock updated.')

				viewProductsForSale();
			}
		})
	})
};

// Run the program ////////////////////////////////////////////////////////////////////////////////////////

// connect to the database
connection.connect(function(err) {
	if (err) throw err;
	// console.log("connected as id " + connection.threadId);
})

mainPrompt();