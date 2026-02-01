const { get } = require("../API/apartments.routes.js");
const db = require("../DB/db.js");

async function getAllDonations() {
  const [rows] = await db.query("SELECT * FROM donations");
  return rows;
}

async function getDonationById(id) {
  const [rows] = await db.query("SELECT * FROM donations WHERE id = ?", [id]);
  return rows[0];
}

async function getFullDonation(id) {
  const [rows] = await db.query(
    "SELECT * FROM donations d NATURAL JOIN users u WHERE id = ?",
    [id]
  );
  return rows[0];
}

async function getDonationByApartmentId(apartmentId) {
  const [rows] = await db.query(
    "SELECT * FROM donations d NATURAL JOIN users u WHERE apartment_Id = ?",
    [apartmentId]
  );
  return rows;
}

async function getDonationByUserId(userId) {
  const [rows] = await db.query("SELECT * FROM donations WHERE user_Id = ?", [
    userId,
  ]);
  return rows;
}

async function getNotVerifiedDonations() {
  console.log(`in getNotVerifiedDonations`);
  const [rows] = await db.query(
    "SELECT * FROM donations NATURAL JOIN users WHERE verified = 0"
  );
  console.log(`rows: ${rows}`);
  return rows;
}

async function getAllAmount() {
  const [rows] = await db.query("SELECT SUM(amount) as amount FROM donations");
  return rows;
}

async function createDonation(donation) {
  console.log(`in create donation ${donation}`);

  const [result] = await db.query("INSERT INTO donations SET ?", donation);
  return { id: result.insertId, ...donation };
}

async function uploadDonations(excelDonations) {
  const donations = await transformDonatesExcelData(excelDonations);
  let result = [];
  for (let donation of donations) {
    result.push(await createDonation(donation));
  }
  return result;
}

async function transformDonatesExcelData(excelData) {
  const [rows] = await db.query("SELECT * FROM users");
console.log(rows);

  return excelData.map((row) => {
    const remarks =
      typeof row["הערות"] === "string" ? row["הערות"].replace(/\s+/g, "") : "";
    console.log(remarks);

    const user = rows.find((user) => {
      console.log(`check  ${user.name} ${String(user.name)} ${String(user.name).replace(/\s+/g, "")}`, remarks.includes(String(user.name).replace(/\s+/g, "")) );
      
      return remarks.includes(String(user.name).replace(/\s+/g, ""));
    });

    return {
      user_id: user ? user.user_id : 1,
      donor_name: row["שם"] || "לא צויין",
      amount: row["סכום"] || 0,
      how: "אשראי",
      // donation_date: row["תאריך עסקה"] || new Date().toISOString().split("T")[0],
      remark: row["הערות"] || "",
      verified: true,
    };
  });
}

async function updateDonation(id, donation) {
  await db.query("UPDATE donations SET ? WHERE id = ?", [donation, id]);
  return { id, ...donation };
}

async function deleteDonation(id) {
  await db.query("DELETE FROM donations WHERE id = ?", [id]);
  console.log(`Donation with id ${id} deleted`);
}

module.exports = {
  getAllDonations,
  getDonationById,
  getDonationByApartmentId,
  getDonationByUserId,
  createDonation,
  updateDonation,
  deleteDonation,
  uploadDonations,
  getAllAmount,
  getNotVerifiedDonations,
  getFullDonation,
};
