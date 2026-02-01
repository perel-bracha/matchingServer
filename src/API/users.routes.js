const express = require("express");
const router = express.Router();
const userService = require("../Services/users.services.js");
const myFs = require("../Services/fs.services.js");
const multer = require("multer");
const path = require("path");
const fs=require('fs');
const uploadDir = path.join(process.cwd(), "uploads");

// נתיב לקבלת כל המשתמשים
router.get("/", async (req, res) => {
  try {
    const apartmentId = req.query.apartmentId;
    const users = apartmentId
      ? await userService.getUserByApartmentId(apartmentId)
      : await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/donations", async (req, res) => {
  try {
    const id = req.params.id;
    const userDonations = await userService.getUserDonations(id);
    res.status(200).json(userDonations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/amount", async (req, res) => {
  try {
    const id = req.params.id;
    const userAmount = await userService.getUserAmount(id);
    res.status(200).json(userAmount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/top/:num", async (req, res) => {
  try {
    const num = req.params.num;
    const users = await userService.getTopUsers(num);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const newUser = await userService.createUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // קובץ נשמר בשרת בתיקייה uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // שינוי שם הקובץ כדי למנוע כפילויות
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "לא נבחר קובץ" });
    }

    const filePath = path.join(uploadDir, req.file.filename);
    console.log(`קובץ התקבל ונשמר בנתיב: ${filePath}`);

    const addUsers = await myFs.readExcelData(filePath);
    // console.log(`תוכן הקובץ נקרא:`, addDonates);

    const newUsers = await userService.uploadUsers(addUsers);
    res.status(201).json(newUsers);
  } catch (error) {
    console.error("שגיאה בעיבוד הקובץ:", error);
    res.status(500).json({ error: error.message });
  }
});
// router.post("/upload", async (req, res) => {
//   try {
//     const file = req.files.file;
//     const filePath = `./uploads/${file.name}`;
//     const addUsers = await fs.readExcelData(filePath);
//     const newUsers = await userService.uploadUsers(addUsers);
//     res.status(201).json(newUsers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.body;
    const updatedUser = await userService.updateUser(id, user);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
