const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Use in-memory store for khodamNames
let khodamNames = { names: [] };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Load monster data
let monsters = [];
fs.readFile(path.join(__dirname, "monsters.json"), "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading monsters.json:", err);
    return;
  }
  monsters = JSON.parse(data);
});

// Endpoint to generate a new khodam name
app.post("/generate", (req, res) => {
  try {
    const name = req.body.name;
    const khodamName = generateUniqueKhodamName(name);

    // Ensure khodamNames.names is an array
    if (!Array.isArray(khodamNames.names)) {
      khodamNames.names = [];
    }

    const isDuplicate = khodamNames.names.some(
      (khodam) => khodam.nama.toLowerCase() === khodamName.nama.toLowerCase()
    );

    if (isDuplicate) {
      res.status(409).send("Nama Khodam sudah ada, silakan coba lagi.");
    } else {
      khodamNames.names.push(khodamName);
      // No need to write to file, just update in-memory store
      res.json({ khodamName: khodamName });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// New API endpoint
app.get("/api/v1", (req, res) => {
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

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Function to generate a unique Khodam name
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
