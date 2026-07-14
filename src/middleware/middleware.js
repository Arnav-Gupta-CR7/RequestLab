/**
 * Global centralized error boundary
 */
const errorHandler = (err, req, res, next) => {
  console.error(`\x1b[31m[Error Hook]\x1b[0m Trace:`, err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || "InternalServerError",
    message: err.message || "An unexpected processing error occurred.",
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
