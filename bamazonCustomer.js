require ('dotenv').config()

var mysql = require("mysql");
var inquirer = require("inquirer");

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
  displayItems();
});

function displayItems() {
  connection.query("SELECT * FROM products", function(err, products) {
    console.log("Karina's Makeup Shop: \n")
    for(var i = 0; i< products.length; i++) {
      console.log ( 
        products[i].item_id + " | " + 
        products[i].product_name.charAt(0).toUpperCase() + products[i].product_name.slice(1) +
        "\nPrice: $" + products[i].price + "\n"   
      );
    }
    runSearch()
    }) 
}

function runSearch() {
  inquirer
    .prompt([
      {
        type: "input", 
        message: "What is the ID of the product you wish to purchase?",
        name: "item"
      },
      {
        type: "input", 
        message: "How many would you like to puchase?",
        name: "quantity",
      },
      // {
      //   type: "confirm", 
      //   message: "Would you like to purchase another item?", 
      //   name: "confirm",
      //   default: true
      // }
    ])
    .then(function(answers) {
      var qurey = connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", 
        [answers.quantity, answers.item],
        function (err, res){
        console.log(res);
        }

      );

      // var item = answers.item;
      // var quantity = answers.quantity;
      // console.log(
      // "\nYOUR RECEIPT" +
      // "\nItem: " + item +
      // "\nQuantity: " + quantity +
      // "\nYour Total = $" )
      

    })
};
