require ('dotenv').config()

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors');

//connecting to mysql
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  //username
  user: "root",
  // Your password
  password: process.env.password,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayTable();
});

//Table settings
 function displayTable() {
  
  var table = new Table({
    head: ['ID'.green, 'Item Name'.green, 'Dept'.green, 'Price'.green, 'Stock'.green],
    colWidths: [5, 40, 15, 10, 10]

  });
  displayInventory();

  function displayInventory() {  
    connection.query("SELECT * FROM products", function(err, products) {
      console.log("Welcome to BAMazon: \n")
      for(var i = 0; i < products.length; i++) {
        
        var itemId = products[i].item_id,
          name = products[i].product_name,
          dept = products[i].department_name,
          price = products[i].price,
          qty = products[i].stock_quantity;

        table.push (
          [itemId, name, dept, price, qty]
        );
      }
      console.log(table.toString());
      runSearch();
    });
  }
 }
function runSearch() {
  inquirer
    .prompt([
      {
        type: "input", 
        name: "item",
        message: "What is the ID of the product you wish to purchase?".green
      },
      {
        type: "input", 
        name: "quantity",
        message: "How many would you like to puchase?".green
      },
    ])
    .then(function(answers) {
      connection.query(
      "SELECT * FROM products WHERE item_id =?", answers.item, function(err, products){
        for(var i = 0; i < products.length; i++) {
          if (answers.quantity > products[i].stock_quantity) {
            console.log("Sorry! Not enough stock to complete your order. Please try again".red);
            runSearch();
          } else {
            console.log(
              "       Your Receipt".rainbow +
            "\n=========== :) ===========")
            console.log(
              "- Item chosen: ".cyan + products[i].product_name +
              "\n" +
              "\n- Quantity: ".cyan + answers.quantity +
              "\n" +
              "\n- Total: ".cyan + "$" + products[i].price * answers.quantity +
              "\n=========================="
            );
            var updatedInv = (products[i].stock_quantity - answers.quanity);
            var purchased = (answers.item);
            confirm(updatedInv, purchased)
          }  
        }
      })
    })
}
  function confirm(updatedInv, purchased) {
    inquirer
    .prompt([
      {
        type:"confirm", 
        name: "confirm", 
        message: "Would you like to proceed to checkout?".green,
        default: true
      }
    ]).then(function(confirmation){
      if (confirmation.confirm === true) {
        connection.query("UPDATE products SET ? WEHRE ?", [{
          stock_quantity: updatedInv
        }, {
          item_id: purchased
        }], function(err, res) {});

        console.log("Thank You for your business! Come again soon".rainbow)
        runSearch();
      } else {
        console.log("So sorry! Come again soon".red)
        runSearch();
      }
    })
  }