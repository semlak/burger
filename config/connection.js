'use strict'

// Set up MySQL connection.
const mysql = require("mysql");

require("dotenv").config();
const dbName = 'burgers_db';


let connection = null;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else {
  connection = mysql.createConnection({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWD,
    database: dbName
  });
}

// Make connection.
connection.connect((err)  => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Export connection for our ORM to use.
module.exports = connection;
