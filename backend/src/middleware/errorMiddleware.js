export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(error.errors).map((item) => item.message).join(', ')
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Session expired. Please sign in again.' });
  }

  res.status(statusCode).json({
    message: error.isOperational ? error.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
