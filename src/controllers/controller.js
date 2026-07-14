const httpClient = require("../utils/httpClient");

/**
 * Executes a client API call from backend context to avoid CORS
 */
const forwardRequest = async (req, res, next) => {
  try {
    const { url, method, headers, body } = req.body;

    const result = await httpClient.executeRequest({
      url,
      method,
      headers,
      body,
    });

    return res.json(result);
  } catch (error) {
    next(error); // Passes execution down to the global error middleware
  }
};

module.exports = { forwardRequest };
