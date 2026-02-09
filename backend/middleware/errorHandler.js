// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

// Not found middleware
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};
