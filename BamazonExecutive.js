// Imports ///////////////////////////////////////////////////////////////////////////////////////////////////
var mysql = require('mysql');
var connection = require('./connection.js');

var table = require('text-table');

var prompt = require('prompt');
var inquirer = require('inquirer');
// Functions ///////////////////////////////////////////////////////////

function mainPrompt() {
	inquirer.prompt(
	{
		'type': 'list',
		'message': 'What would you like to do today, sir?',
		'choices': ['View Sales by Department', 'Add New Department', 'Exit'],
		'name': 'choice'
	}).then(function(answers){

		switch (answers.choice) {
			case 'View Sales by Department':

				salesByDepartment();
				break;

			case 'Add New Department':

				addNewDepartment();
				break;

			case 'Exit':
				process.exit();
		}
	})
};

function salesByDepartment() {

	// query the database
	connection.query('select * from departments', function(err, res) {

		// Display Department ID, Department name, overhead costs, and total sales of each department in the database
		var dataToDisplay = [["\nID", "Department Name", "Overhead", 'Sales', 'Profit'], ['==','====================================================', '==========', '======', '======']];


		// loop through the results of the database query and display items in a table
		for (i = 0; i < res.length; i++){

			var row = [];
			var department = res[i];

			var profit = '$'+ (department.TotalSales - department.OverHeadCosts);

			row.push(department.DepartmentID, department.DepartmentName, '$' + department.OverHeadCosts, '$' + department.TotalSales, profit)

			dataToDisplay.push(row)
		};

		var display = table( dataToDisplay, {hsep:' | '})

		console.log(display);
		console.log('\n')

		mainPrompt();

	});
}

function addNewDepartment() {

	prompt.start();

	prompt.get(['DepartmentName', 'Overhead', 'Sales'], function(err, res) {
		var department = res;
		var query = 'insert into departments (DepartmentName, OverHeadCosts, TotalSales) values (?,?,?);'
		var parameters = [ department.DepartmentName, department.Overhead, department.Sales ]
		
		connection.query(query, parameters, function(err, res) {
			if (err){
				console.log(err)
			}
			else{

				salesByDepartment();
			}
		})
	})
}

mainPrompt();