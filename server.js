const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
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

function generateUniqueKhodamName(name) {
  const matrixSize = 6;
  const usedIndices = new Set();
  let khodamName;

  // Function to generate a unique random index using custom logic
  function generateRandomIndex() {
    while (true) {
      // 1. Hitung jumlah karakter
      const charCount = name.length;

      // 2. Pembagian dengan 1,75
      const dividedValue = charCount / 1.75;

      // 3. Substitusi: menghasilkan angka acak dari nilai dibagi
      const randomValue = Math.floor(dividedValue);

      // 4. Perkalian dengan 2
      const multipliedValue = randomValue * 2;

      // 5. Matriks 6 dan pangkat 2
      const index = Math.pow(multipliedValue % matrixSize, 2) % monsters.length;

      if (!usedIndices.has(index)) {
        usedIndices.add(index);
        return index;
      }
    }
  }

  const randomIndex = generateRandomIndex();
  const monster = monsters[randomIndex];
  khodamName = {
    nama: `${name}-${monster.nama_khodam}`,
    tipe: monster.tipe_khodam,
    asal: monster.asal,
  };

  return khodamName;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
