const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Load monsters data
let monsters = [];
fs.readFile(path.join(__dirname, "monsters.json"), "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading monsters.json:", err);
    return;
  }
  monsters = JSON.parse(data);
  console.log("Loaded monster names:", monsters);
});

// API endpoint for generating khodam name
app.post("/generate", (req, res) => {
  try {
    const name = req.body.name;
    const khodamName = generateUniqueKhodamName(name);

    const data = JSON.parse(fs.readFileSync("khodamNames.json", "utf-8"));

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

// API endpoint for /api/v1
app.use("/api/v1", require("./api/v1/index"));

// Serve the static index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
