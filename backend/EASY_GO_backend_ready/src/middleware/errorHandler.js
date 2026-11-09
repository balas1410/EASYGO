export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = Number(error.status) || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({
    success: false,
    message: status < 500 ? error.message : "An unexpected server error occurred."
  });
}
