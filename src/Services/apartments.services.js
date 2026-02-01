const db = require("../DB/db.js");

async function getAllApartments() {
  // console.log(`in get all apartments services`);
  const [rows] = await db.query("SELECT * FROM apartments");
  // console.log(`all apartments rows: ${rows}`);
  return rows;
}

async function getApartmentById(id) {
  const [rows] = await db.query(
    "SELECT * FROM apartments WHERE apartment_id = ?",
    [id]
  );
  return rows[0];
}
async function getApartmentsDonations() {
  const [rows] = await db.query(
    `SELECT a.apartment_id, a.apart_name, COALESCE(SUM(d.amount), 0) as totalDonations
     FROM apartments a
     LEFT JOIN users u ON a.apartment_id = u.apartment_id
     LEFT JOIN donations d ON u.user_id = d.user_id
     GROUP BY a.apartment_id, a.apart_name`
  );
  return rows;
}
// async function getApartmentsDonations() {
//   const [rows] = await db.query(
//     "SELECT apartment_id, apart_name, SUM(donations.amount) as totalDonations FROM apartments NATURAL JOIN users NATURAL JOIN donations GROUP BY apartment_id, apart_name"
//   );
//   return rows;
// }

async function getApartmentDonations(id) {
  const [rows] = await db.query(
    `SELECT u.user_id, u.name, u.apartment_id, COALESCE(SUM(d.amount), 0) as totalDonations
     FROM users u
     LEFT JOIN donations d ON u.user_id = d.user_id
     WHERE u.apartment_id = ?
     GROUP BY u.user_id, u.name, u.apartment_id`,
    [id]
  );
  return rows;
}
async function getApartmentTotalDonations(id) {
  const [rows] = await db.query(
    `SELECT a.apartment_id, a.apart_name, COALESCE(SUM(d.amount), 0) as totalDonations
     FROM apartments a
     LEFT JOIN users u ON a.apartment_id = u.apartment_id
     LEFT JOIN donations d ON u.user_id = d.user_id
     WHERE a.apartment_id = ?
     GROUP BY a.apartment_id, a.apart_name`,
    [id]
  );
  return rows[0];
}
// async function getApartmentTotalDonations(id) {  
//   const [rows] = await db.query(
//     "SELECT apartment_id, apart_name, SUM(donations.amount) as totalDonations FROM apartments NATURAL JOIN users NATURAL JOIN donations WHERE apartment_id = ? GROUP BY apartment_id, apart_name ",
//     [id]
//   );
//   console.log(rows, rows[0]);
  
//   return rows[0];
// }

async function getApartmentAmount(id) {
  const [rows] = await db.query(
    "SELECT SUM(donations.amount) as amount FROM apartments NATURAL JOIN users NATURAL JOIN donations WHERE apartment_Id = ?",
    [id]
  );
  return rows[0];
}

async function getTopApartments(num) {
  const [rows] = await db.query(
    "SELECT apartment_id, apart_name, SUM(donations.amount) as totalDonations FROM apartments NATURAL JOIN users NATURAL JOIN donations WHERE apartment_Id != 21 GROUP BY apartment_Id ORDER BY totalDonations DESC LIMIT ?",
    [parseInt(num, 10)]
  );
  return rows;
}

async function createApartment(apartment) {
  const [result] = await db.query("INSERT INTO apartments SET ?", apartment);
  return { id: result.insertId, ...apartment };
}

async function uploadApartments(excelApartments) {
  const apartments = transformApartmentsExcelData(excelApartments);
  let result = [];
  for (let apartment of apartments) {
    result.push(await createApartment(apartment));
  }
  return result;
}

function transformApartmentsExcelData(excelData) {
  return excelData.map((row) => ({
    name: row["שם"],
  }));
}

async function deleteApartment(id) {
  await db.query("DELETE FROM apartments WHERE apartment_id = ?", [id]);
}

module.exports = {
  getAllApartments,
  getApartmentById,
  getApartmentsDonations,
  getApartmentDonations,
  createApartment,
  deleteApartment,
  uploadApartments,
  getTopApartments,
  getApartmentAmount,
  getApartmentTotalDonations,
};
