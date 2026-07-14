const express = require("express");
const router = express.Router();

// Dummy endpoints for instant testing
router.get("/test", (req, res) => {
  res.json({
    message: "Hello from Postman-Lite!",
    method: "GET",
    status: "success",
  });
});

router.post("/test", (req, res) => {
  res.json({
    message: "Data received!",
    method: "POST",
    receivedBody: req.body,
  });
});

// Proxy route to bypass CORS limitations
router.post("/proxy", async (req, res) => {
  const { url, method, headers, body } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: method || "GET",
      headers: headers || {},
      body: ["GET", "HEAD"].includes(method) ? undefined : JSON.stringify(body),
    });
    const duration = Date.now() - startTime;

    const contentType = response.headers.get("content-type") || "";
    let responseData;

    if (contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    res.json({
      status: response.status,
      statusText: response.statusText,
      time: `${duration}ms`,
      headers: responseHeaders,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
