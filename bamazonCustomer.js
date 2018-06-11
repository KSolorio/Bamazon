require ('dotenv').config()
// Requiring Modules
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
  //console.log("CONNECTED TO MYSQL")
});

//This will display Mysql data
function start() {  
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    //Table settings  
      var table = new Table({
        head: ['ID'.green, 'Item Name'.green, 'Dept'.green, 'Price'.green, 'Stock'.green],
        colWidths: [5, 40, 15, 10, 10]
      });

      console.log(
        "\n========================".blue +
        "\n  Welcome to BAMAZON: ".rainbow +
        "\n========================".blue);

      for(var i = 0; i < res.length; i++) {
        //creating variables in order to use the table
        
        table.push (
          [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity]
        );
      }
      //displaying table
      console.log(table.toString());
    
      //inquirer prompt:
      inquirer
      .prompt([
        {
          type: "input", 
          name: "item",
          message: "What is the ID of the product you wish to purchase?".green,
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          type: "input", 
          name: "quantity",
          message: "How many would you like to puchase?".green,
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        },
      ])
       .then(function(answer) {
         //set variables for the chosen item
         var chosenId = answer.item -1
         var chosenName = answer[chosenId]
         var chosenQty = answer.quantity

        if (chosenQty > res[chosenId].stock_quantity) {
          console.log("Sorry! Not enough stock to complete your order. Please try again".red);
          start();

        } else {
          console.log(
            "       Your Cart".rainbow +
            "\n=========== :) ===========")
            console.log(
              "- Item chosen: ".cyan + res[chosenId].product_name +
              "\n" +
              "\n- Quantity: ".cyan + chosenQty +
              "\n" +
              "\n- Total: ".cyan + "$" + res[chosenId].price.toFixed(2) * chosenQty +
              "\n=========================="
            );
          connection.query(
            "UPDATE products SET ? WHERE ?", [{
              stock_quantity: res[chosenId].stock_quantity - chosenQty
              }, 
              {
                item_id: res[chosenId].item_id
              }], function(err, res) {
                  start();
              });  
         }
       });
   })
 }
start();
