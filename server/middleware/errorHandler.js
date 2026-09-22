/**
 * Error Handler Middleware
 * Gestione centralizzata degli errori con logging e response standardizzate
 */

const winston = require('winston');

// Logger configuration
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
    new winston.transports.Console()
  ]
});

class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Errore interno del server';
  let details = err.details || null;

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token non valido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token scaduto';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Dati di input non validi';
    details = err.details;
  }

  // PostgreSQL errors
  if (err.code === '23505') {
    statusCode = 409;
    message = 'Duplicato: record già esistente';
  }

  if (err.code === '23503') {
    statusCode = 400;
    message = 'Violazione vincolo di integrità referenziale';
  }

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    statusCode
  });

  // Security monitoring - log critical errors
  if (statusCode >= 500) {
    console.error('[SECURITY] Server error detected:', {
      type: 'server_error',
      severity: 'high',
      message: err.message,
      path: req.originalUrl
    });
  }

  // Response
  const response = {
    success: false,
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler, AppError };
