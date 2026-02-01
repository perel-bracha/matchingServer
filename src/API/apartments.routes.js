const express = require("express");
const router = express.Router();
const apartServices = require("../Services/apartments.services.js");
const fsServices = require("../Services/fs.services.js");

router.get("/", async (req, res) => {
  try {
    // console.log(`in get all apartments routes`);
    const apartments = await apartServices.getAllApartments();
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/donations", async (req, res) => {
  try {
    const apartDonations = await apartServices.getApartmentsDonations();
    res.status(200).json(apartDonations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/donations", async (req, res) => {
  try {
    const id = req.params.id;
    const apartDonations = await apartServices.getApartmentDonations(id);
    res.status(200).json(apartDonations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/totalDonations", async (req, res) => {
  try {
    const id = req.params.id;
    const apartTotalDonations = await apartServices.getApartmentTotalDonations(id);
    res.status(200).json({ apartTotalDonations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const apartment = await apartServices.getApartmentById(id);
    res.status(200).json(apartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/amount", async (req, res) => {
  try {
    const id = req.params.id;
    const apartmentAmount = await apartServices.getApartmentAmount(id);
    res.status(200).json(apartmentAmount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/top/:num", async (req, res) => {
  try {
    const num = req.params.num;
    const apartments = await apartServices.getTopApartments(num);
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const apartment = req.body;
    const newApartment = await apartServices.createApartment(apartment);
    res.status(201).json(newApartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/upload", async (req, res) => {
  try {
    const file = req.files.file;
    const filePath = `./uploads/${file.name}`;
    const addApartments = await fsServices.readExcelData(data);
    const newApartments = await apartServices.uploadApartments(addApartments);
    res.status(201).json(newApartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
