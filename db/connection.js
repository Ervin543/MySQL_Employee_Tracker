const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dasratt1992",
  database: "employees"
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;