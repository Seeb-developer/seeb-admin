const https = require("https");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const key = fs.readFileSync(path.resolve(__dirname, "certification/key.pem"));
const cert = fs.readFileSync(path.resolve(__dirname, "certification/cert.pem"));
const options = {
  key,
  cert,
};

// Serve the static files (build folder) over HTTPS
app.use(express.static(path.join(__dirname, "build")));

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
