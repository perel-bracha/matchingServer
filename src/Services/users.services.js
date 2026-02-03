const { get } = require("../API/apartments.routes.js");
const db = require("../DB/db.js");

async function getAllUsers() {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
}

async function getUserById(id) {
  const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [id]);
  return rows[0];
}

async function getUserByApartmentId(apartmentId) {
  const [rows] = await db.query("SELECT * FROM users WHERE apartment_Id = ?", [
    apartmentId,
  ]);
  return rows;
}

async function getUserDonations(id) {
  const [rows] = await db.query("SELECT * FROM donations WHERE user_id = ?", [
    id,
  ]);
  return rows;
}

async function getUserAmount(id) {
  const [rows] = await db.query(
    "SELECT SUM(amount) as amount FROM donations WHERE user_id = ?",
    [id]
  );
  return rows[0];
}

async function getTopUsers(num) {
  const [rows] = await db.query(
    "SELECT user_id, name, apartment_id, SUM(donations.amount) as totalDonations FROM users NATURAL JOIN donations WHERE user_id !=1 GROUP BY user_id, name, apartment_id ORDER BY totalDonations DESC LIMIT ?",
    [parseInt(num, 10)]
  );
  return rows;
}

async function createUser(user) {
  const [result] = await db.query("INSERT INTO users SET ?", user);
  return { id: result.insertId, ...user };
}

async function uploadUsers(excelUsers) {
  const users = await transformUsersExcelData(excelUsers);
  let result = [];
  for (let user of users) {
    result.push(await createUser(user));
  }
  return result;
}

async function updateUser(id, user) {
  await db.query("UPDATE users SET ? WHERE user_id = ?", [user, id]);
  return { id, ...user };
}

async function transformUsersExcelData(excelData) {
  const [rows] = await db.query("SELECT * FROM apartments");
  console.log(rows);
  
  return excelData.map((row) => {
    console.log(row["דירה_מס"]);
    const apartment = rows.find((apart) => {
      console.log(apart.apartment_id);
      return row["דירה_מס"] == apart.apart_name;
    });
    console.log(apartment);

    return {
      name: `${row["שם_פרטי"]} ${row["שם_משפחה"]}`, // מאחדים שם פרטי + משפחה
      apartment_id: apartment ? apartment.apartment_id : null,
    };
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  getUserByApartmentId,
  uploadUsers,
  getTopUsers,
  getUserDonations,
  getUserAmount,
};