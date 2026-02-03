var mysql = require("mysql2");
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

function createDB() {

    var connection = mysql.createConnection({
   host: 'hopper.proxy.rlwy.net', // Host from the connection string
  user: 'root',                  // User from the connection string
  password: 'rezRQDbDUWQZHoTPbBKbHdamCXjXSCVa', // Password from the connection string
  database: 'railway',           // Database name from the connection string
  port: 3306
    });
    
    connection.connect(function (err) {
      if (err) throw err;
      console.log(" first connected to db succied");
    });

    connection.query(`CREATE DATABASE ${"matching_db"}`, function (err, result) {
      if (err) throw err;
      console.log(`${process.env.DB_NAME} created`);
    });

    // return new Promise((resolve, reject) => {
    //     conDB.query(`CREATE DATABASE ${process.env.DB_NAME}`, (err, result) => {
    //         if (err) return reject(err);
    //         console.log(`${process.env.DB_DATABASE} database created`);
    //         resolve(result);
    //     });
    // });
}
createDB();
module.exports = createDB;