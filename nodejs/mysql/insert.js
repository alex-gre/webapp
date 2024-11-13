const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "productdb",
    password: ""
});

const product = ["x10", "TestCOmp", 1000];
const sql = "INSERT INTO products( model, company, price) VALUES( ?, ?, ?)";

connection.query(sql, product, function(err, results) {
    if (err) console.log(err);
    else console.log("Данные добавлены");
});

connection.end();