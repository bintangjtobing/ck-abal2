const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "khodamNames.json");

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({ names: [] }, null, 2));
  console.log("Created khodamNames.json with default content.");
} else {
  console.log("khodamNames.json already exists.");
}
