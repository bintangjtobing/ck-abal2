const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Define the path to khodamNames.json
const khodamNamesPath = path.join(__dirname, "../../khodamNames.json");

// Function to read and parse the khodamNames.json
function readKhodamNames() {
  try {
    const data = fs.readFileSync(khodamNamesPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading khodamNames.json:", err);
    return { names: [] }; // Return default empty structure if there's an error
  }
}

// Load monsters data
let monsters = [];
fs.readFile(
  path.join(__dirname, "../../monsters.json"),
  "utf-8",
  (err, data) => {
    if (err) {
      console.error("Error reading monsters.json:", err);
      return;
    }
    monsters = JSON.parse(data);
  }
);

// API endpoint for /api/v1
router.get("/", (req, res) => {
  try {
    const name = req.query.name;
    if (!name) {
      return res.status(400).send("Parameter 'name' is required");
    }

    const khodamName = generateUniqueKhodamName(name);
    res.json({
      khodamName: khodamName,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Function to generate unique Khodam name
function generateUniqueKhodamName(name) {
  if (monsters.length === 0) {
    throw new Error("Monsters data is empty");
  }

  const randomIndex = Math.floor(Math.random() * monsters.length);
  const monster = monsters[randomIndex];

  if (!monster || !monster.nama_khodam) {
    throw new Error("Invalid monster data");
  }

  return {
    nama: `${name}-${monster.nama_khodam}`,
    tipe: monster.tipe_khodam,
    asal: monster.asal,
  };
}

module.exports = router;
