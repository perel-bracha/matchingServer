var mysql = require("mysql2");
var path = require("path");
const conDB = require("./connectToDB");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

async function initializeDB() {
  // הכנסת נתונים התחלתיים לטבלת users
  const insertUsers = `
INSERT INTO users (name, apartment_id) VALUES
('לא ידוע', 21);`;

  // הכנסת נתונים התחלתיים לטבלת donations
//   const insertDonations = `
// INSERT INTO donations (user_id, donor_name, amount, how, donation_date, remark, verified)
// VALUES 
// (1, 'יוסי כהן', 500.00, 'מזומן', '2025-02-13 10:30:00', 'תרומה שנתית', 1),
// (2, 'רחל לוי', 1000.50, 'העברה בנקאית', '2025-02-14 14:45:00', '', 0),
// (3, 'משה דן', 250.75, 'אשראי', '2025-02-15 18:20:00', 'עבור בית הספר', 1);
// `;

  const insertApartments = `INSERT INTO apartments (apart_name) VALUES
('דירה 1'),
('דירה 2'),
('דירה 3'),
('דירה 4'),
('דירה 5'),
('דירה 6'),
('דירה 7'),
('דירה 8'),
('דירה 9'),
('דירה 10'),
('דירת לב'),
('חבצלת'),
('מרכז עילית'),
('חדשים 1'),
('חדשים 2'),
('וילה'),
('404'),
('מדשאה'),
('ציגלה'),
('צוות'),
('לא ידוע');
`;

  await conDB.promise().query(insertApartments);
  console.log("Initial apartments inserted");

  await conDB.promise().query(insertUsers);
  console.log("Initial users inserted");

  // await conDB.promise().query(insertDonations);
  // console.log("Initial donations inserted");
}

initializeDB();
module.exports = initializeDB;
