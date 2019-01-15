var mysql = require('mysql');
var inquirer = require('inquirer');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  port:"3306",
  password: "password",
  database: "mydb"
});
var input = process.stdin;

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err; 
   for(i = 0; i < 10; i++){
        console.log(result[i].item_id + " " + result[i].product_name + " " + result[i].price + " " + result[i].stock_quantity)
   }
   inquirer.prompt([
    {
        name: "item_id",
        type: "input",
        message: "Enter ID of item you would like to purchase"
    },
    {
        name: "amount",
        type: "input",
        message: "Enter ammount"
    }
])
    .then(function (input) {
        var purchase = input.item_id;
        var amount = input.amount;
        var query = 'SELECT * FROM products WHERE ?';
        con.query(query, { item_id: purchase }, function (err, data) {
            var userInput = data[0];
            if (err) throw err;
            if (data.length === null || data.length == 0) {
                console.log("Syntax error");
            }
            else if (amount <= userInput.stock_quantity) {
                var newquantity = (userInput.stock_quantity - amount);
                con.query('UPDATE products SET stock_quantity = :quant1 WHERE stock_quantity = :quant2',
                {quant1: newquantity, quant2: userInput.stock_quantity})
                console.log("Purchase complete, the new quantity of purchased item is " + newquantity +". Your subtotal comes out to " + result[purchase - 1].price * amount);

              
            }
            else {
                console.log("Not enough item(s) in stock! There's only " + userInput.stock_quantity + " left in stock.")
            }
            process.exit()
        }
        )
    }
    )
  });
});