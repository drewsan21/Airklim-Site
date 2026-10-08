/**
 * Audit Logger Middleware
 * Logging completo di tutte le operazioni critiche per compliance e sicurezza
 */

const winston = require('winston');
const { Pool } = require('pg');

// Audit log logger
const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'audit-log' },
  transports: [
    new winston.transports.File({ filename: 'logs/audit.log' }),
    new winston.transports.File({ filename: 'logs/audit-error.log', level: 'error' })
  ]
});

// PostgreSQL pool for audit storage
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Create audit_logs table if not exists
const createAuditTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_id VARCHAR(255),
        user_email VARCHAR(255),
        action VARCHAR(50) NOT NULL,
        resource VARCHAR(100) NOT NULL,
        resource_id VARCHAR(255),
        details JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        severity VARCHAR(20) DEFAULT 'info',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
    `);
  } finally {
    client.release();
  }
};

// Initialize table (retry a few times so the server can start before Postgres is ready,
// e.g. in docker-compose where the backend may boot ahead of the DB)
const initAuditTable = async (retries = 5, delayMs = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await createAuditTable();
      console.log('[AUDIT] audit_logs table ready');
      return;
    } catch (err) {
      if (i === retries) {
        console.warn(`[AUDIT] Could not initialize audit_logs after ${retries} attempts: ${err.message}`);
        return;
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
};
initAuditTable();

// Audit log middleware
const auditLog = (options = {}) => {
  return async (req, res, next) => {
    const startTime = Date.now();
    
    // Capture original response methods
    const originalJson = res.json;
    const originalSend = res.send;
    
    // Override response methods to capture response data
    res.json = function(data) {
      this._responseData = data;
      return originalJson.apply(this, arguments);
    };
    
    res.send = function(data) {
      this._responseData = data;
      return originalSend.apply(this, arguments);
    };
    
    // Log after response is sent
    res.on('finish', async () => {
      try {
        const duration = Date.now() - startTime;
        const logEntry = {
          timestamp: new Date().toISOString(),
          user_id: req.user?.id || null,
          user_email: req.user?.email || null,
          action: options.action || req.method.toLowerCase(),
          resource: options.resource || req.baseUrl.replace('/api/', ''),
          resource_id: req.params.id || null,
          details: {
            method: req.method,
            url: req.originalUrl,
            query: req.query,
            body: sanitizeBody(req.body),
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            responseSize: res._responseData ? JSON.stringify(res._responseData).length : 0
          },
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.get('User-Agent'),
          severity: determineSeverity(res.statusCode, options.action)
        };
        
        // Log to file
        auditLogger.info('API Request', logEntry);
        
        // Store in database
        await storeAuditLog(logEntry);
        
        // Security monitoring
        if (logEntry.severity === 'high' || logEntry.severity === 'critical') {
          console.warn('[AUDIT] High severity event:', logEntry);
        }
      } catch (error) {
        console.error('Error in audit logger:', error);
      }
    });
    
    next();
  };
};

// Sanitize sensitive data from request body
const sanitizeBody = (body) => {
  if (!body) return null;
  
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'passwordConfirm', 'creditCard', 'cvv', 'token', 'secret'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

// Determine severity based on status code and action
const determineSeverity = (statusCode, action) => {
  if (statusCode >= 500) return 'critical';
  if (statusCode === 401 || statusCode === 403) return 'high';
  if (statusCode >= 400) return 'medium';
  if (action === 'delete') return 'high';
  if (action === 'login' || action === 'logout') return 'medium';
  return 'info';
};

// Store audit log in database
const storeAuditLog = async (logEntry) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs 
       (user_id, user_email, action, resource, resource_id, details, ip_address, user_agent, severity)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        logEntry.user_id,
        logEntry.user_email,
        logEntry.action,
        logEntry.resource,
        logEntry.resource_id,
        JSON.stringify(logEntry.details),
        logEntry.ip_address,
        logEntry.user_agent,
        logEntry.severity
      ]
    );
  } catch (error) {
    console.error('Error storing audit log:', error);
  }
};

// Get audit logs with filters
const getAuditLogs = async (filters = {}) => {
  const { userId, action, severity, startDate, endDate, limit = 100, offset = 0 } = filters;
  
  let query = 'SELECT * FROM audit_logs WHERE 1=1';
  const params = [];
  let paramCount = 0;
  
  if (userId) {
    paramCount++;
    query += ` AND user_id = $${paramCount}`;
    params.push(userId);
  }
  
  if (action) {
    paramCount++;
    query += ` AND action = $${paramCount}`;
    params.push(action);
  }
  
  if (severity) {
    paramCount++;
    query += ` AND severity = $${paramCount}`;
    params.push(severity);
  }
  
  if (startDate) {
    paramCount++;
    query += ` AND timestamp >= $${paramCount}`;
    params.push(startDate);
  }
  
  if (endDate) {
    paramCount++;
    query += ` AND timestamp <= $${paramCount}`;
    params.push(endDate);
  }
  
  query += ' ORDER BY timestamp DESC';
  
  paramCount++;
  query += ` LIMIT $${paramCount}`;
  params.push(limit);
  
  paramCount++;
  query += ` OFFSET $${paramCount}`;
  params.push(offset);
  
  const result = await pool.query(query, params);
  return result.rows;
};

// Export audit log to CSV
const exportAuditLogs = async (filters = {}) => {
  const logs = await getAuditLogs({ ...filters, limit: 10000 });
  
  const csvRows = [
    ['Timestamp', 'User ID', 'User Email', 'Action', 'Resource', 'Resource ID', 'IP Address', 'Severity', 'Details'].join(',')
  ];
  
  logs.forEach(log => {
    csvRows.push([
      log.timestamp,
      log.user_id || '',
      log.user_email || '',
      log.action,
      log.resource,
      log.resource_id || '',
      log.ip_address,
      log.severity,
      `"${JSON.stringify(log.details).replace(/"/g, '""')}"`
    ].join(','));
  });
  
  return csvRows.join('\n');
};

module.exports = {
  auditLog,
  auditLogger,
  getAuditLogs,
  exportAuditLogs
};
