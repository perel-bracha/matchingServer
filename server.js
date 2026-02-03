// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const socketIo = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: { origin: "*" }, // מאפשר חיבורים מכל מקום
// });
// app.use(cors());
// app.use(express.json()); // מאפשר שליחת JSON בבקשות

// // נתיבים לדוגמה
// app.use("/users", require("./src/API/users.routes"));
// app.use("/apartments", require("./src/API/apartments.routes"));
// app.use("/donations", require("./src/API/donations.routes")(io));
// io.on("connection", (socket) => {
//   console.log("לקוח מחובר");

//   socket.on("disconnect", () => {
//     console.log("לקוח התנתק");
//   });
// });
// app.get("", (req, res) => {
//   return res.status(200).json("maching server");
// });

// const PORT = process.env.PORT || 8080;
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
var mysql = require("mysql2");
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים
// const conDB = require("./src/DB/connectToDB");

function cleanDB() {
  conDB.query(
    "DROP DATABASE IF EXISTS " + "railway",
    function (err, result) {
      if (err) throw err;
      console.log("Database dropped");
    }
  );
}

cleanDB();
module.exports = cleanDB;
