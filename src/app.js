const express = require("express");
const path = require("path");
const routes = require("./routes/routes");

const app = express();

app.use(express.json());

// Serve static frontend assets from the src/public directory
app.use(express.static(path.join(__dirname, "public")));

// Mount API routes
app.use("/api", routes);

module.exports = app;
