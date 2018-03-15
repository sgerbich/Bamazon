var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");

    readProducts();


});

function go() {

    inquirer
        .prompt([{
            name: "product_choice",
            type: "input",
            message: "What item would you like to purchase?"
        },
        {
            name: "how_many",
            type: "input",
            message: "how many would you like to purchase?"
        }])
        .then(function (answer) {

            // console.log(answer.product_choice)

          checkStock(answer.product_choice, answer.how_many);
           
        });

}

function readProducts() {
    // console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            
            //   console.log(res);
            console.log(res[i].item_id + " " + res[i].product_name +
                " " + res[i].price);
        }
        // connection.end();
        go();
    });
}

function checkStock(id, howMany) {
    console.log("checking stock \n");
    // console.log(id + " " + howMany);
    connection.query("SELECT * FROM products WHERE item_id = " + id, function (err, res) {
        if (err) throw err;
        // console.log(res[0].stock_quantity);
        if (res[0].stock_quantity > 0 && howMany < res[0].stock_quantity) {
            var price = res[0].price;
            var stock = res[0].stock_quantity;
            // console.log("here");
            purchaseItems(id, howMany, stock, price);
        } else {
            console.log("Insufficient quantity!");
            connection.end();
        }
        // WHERE item_id = " + id
        
    });
}

function purchaseItems(id, howMany, stock, price) {
    stock = stock - howMany;
    totalPrice = price * howMany;
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity : stock
            },
            {
                item_id: id
            }
        ],
        function (error) {
            if (error) throw err;
            console.log("Bid placed successfully!");
            console.log("Your total cost is " + totalPrice);
            connection.end();
        }
    );
}
 