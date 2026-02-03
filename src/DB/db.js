var path = require("path");
var mysql = require("mysql2");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

const pool = mysql.createPool({
   host: 'hopper.proxy.rlwy.net', // Host from the connection string
  user: 'root',                  // User from the connection string
  password: 'rezRQDbDUWQZHoTPbBKbHdamCXjXSCVa', // Password from the connection string
  database: 'railway',           // Database name from the connection string

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();