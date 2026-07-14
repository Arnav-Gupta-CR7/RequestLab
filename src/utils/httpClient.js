/**
 * Custom fetch wrapper optimized for handling incoming proxy configurations
 */
const executeRequest = async ({ url, method = "GET", headers = {}, body }) => {
  const options = {
    method: method.toUpperCase(),
    headers: { ...headers },
  };

  // Attach body payloads only on writing transactions
  if (!["GET", "HEAD"].includes(options.method) && body) {
    options.body = typeof body === "object" ? JSON.stringify(body) : body;
  }

  const startTime = Date.now();
  const response = await fetch(url, options);
  const duration = Date.now() - startTime;

  const contentType = response.headers.get("content-type") || "";
  let data;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else if (contentType.includes("text/")) {
    data = await response.text();
  } else {
    // Handling binary, streams or buffers as Base64 fallback strings
    const buffer = await response.arrayBuffer();
    data = `[Binary Content] Size: ${buffer.byteLength} bytes. Content-Type: ${contentType}`;
  }

  // Parse raw map entries into an standard object structure
  const responseHeaders = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  return {
    status: response.status,
    statusText: response.statusText,
    time: `${duration}ms`,
    headers: responseHeaders,
    data,
  };
};

module.exports = { executeRequest };
