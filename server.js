const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let monsters = [];

// Load monster names from monsters.json
fs.readFile("monsters.json", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading monsters.json:", err);
    return;
  }
  monsters = JSON.parse(data);
  console.log("Loaded monster names:", monsters);
});

app.post("/generate", (req, res) => {
  try {
    const name = req.body.name;
    const khodamName = generateUniqueKhodamName(name);

    const data = JSON.parse(fs.readFileSync("khodamNames.json", "utf-8"));

    // Ensure data.names is an array
    if (!Array.isArray(data.names)) {
      data.names = [];
    }

    const isDuplicate = data.names.some(
      (khodam) => khodam.nama.toLowerCase() === khodamName.nama.toLowerCase()
    );

    if (isDuplicate) {
      res.status(409).send("Nama Khodam sudah ada, silakan coba lagi.");
    } else {
      data.names.push(khodamName);
      fs.writeFileSync("khodamNames.json", JSON.stringify(data, null, 2));
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
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
function generateUniqueKhodamName(name) {
  const randomIndex = Math.floor(Math.random() * monsters.length);
  const monster = monsters[randomIndex];
  return {
    nama: `${name}-${monster.nama_khodam}`,
    tipe: monster.tipe_khodam,
    asal: monster.asal,
  };
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
