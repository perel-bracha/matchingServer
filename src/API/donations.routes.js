const express = require("express");
const router = express.Router();
const donationService = require("../Services/donations.services.js");
const myFs = require("../Services/fs.services.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
module.exports = (io) => {
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  // נתיב לקבלת כל המשתמשים
  router.get("/", async (req, res) => {
    try {
      const apartmentId = req.query.apartmentId;
      const userId = req.query.userId;
      const donates = apartmentId
        ? await donationService.getDonationByApartmentId(apartmentId)
        : userId
        ? await donationService.getDonationByUserId(userId)
        : await donationService.getAllDonations();
      res.status(200).json(donates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/notVerified", async (req, res) => {
    try {
      // console.log(`in get not verified routes`);
      const donates = await donationService.getNotVerifiedDonations();
      res.status(200).json(donates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/amount", async (req, res) => {
    try {
      const amount = await donationService.getAllAmount();
      res.status(200).json(amount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      // console.log(`in get donation by id routes`);
      const id = req.params.id;
      const donate = await donationService.getDonationById(id);
      res.status(200).json(donate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const donate = req.body;
      console.log(`post donate ${donate}`);
      const prevAmount = await donationService.getAllAmount();
      const newDonate = await donationService.createDonation(donate);
      console.log("📡 שולחת את האירוע newDonation לכל הלקוחות...");
      const fullDonate = await donationService.getFullDonation(newDonate.id);
      io.emit("newDonation", fullDonate);
      const amount = await donationService.getAllAmount();

      if (
        parseFloat(prevAmount[0].amount) < 200000 &&
        parseFloat(amount[0].amount) >= 200000
      ) {
        console.log(`in`);

        io.emit("achievment");
      }
      res.status(201).json(newDonate);
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
      const prevAmount = await donationService.getAllAmount();

      const addDonates = await myFs.readExcelData(filePath);
      // console.log(`תוכן הקובץ נקרא:`, addDonates);

      const newDonates = await donationService.uploadDonations(addDonates);
      const filtered = newDonates.filter((d) => d.user_id != 1);

      for (const d of filtered) {
        const fullDon = await donationService.getFullDonation(d.id);
        io.emit("newDonation", fullDon);
      }
      const amount = await donationService.getAllAmount();
      if (
        parseFloat(prevAmount[0].amount) < 150000 &&
        parseFloat(amount[0].amount) >= 150000
      )
        io.emit("achievment");

      res.status(201).json(newDonates);
    } catch (error) {
      console.error("שגיאה בעיבוד הקובץ:", error);
      res.status(500).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await donationService.deleteDonation(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const donate = req.body;
      const updatedDonate = await donationService.updateDonation(id, donate);

      const fullDonate = await donationService.getFullDonation(
        updatedDonate.id
      );
      io.emit("newDonation", fullDonate);
      res.status(200).json(updatedDonate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  return router;
};
