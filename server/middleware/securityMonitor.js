/**
 * Security Monitor Middleware
 * Monitoraggio in tempo reale delle minacce e attività sospette
 */

const winston = require('winston');

// Security logger
const securityLogger = winston.createLogger({
  level: 'warn',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'security-monitor' },
  transports: [
    new winston.transports.File({ filename: 'logs/security.log' }),
    new winston.transports.File({ filename: 'logs/security-alerts.log', level: 'error' })
  ]
});

// In-memory store for threat detection
const threatStore = {
  failedLogins: new Map(), // IP -> { count, firstAttempt, lastAttempt }
  suspiciousRequests: new Map(), // IP -> { count, patterns }
  blockedIPs: new Set(),
  rateLimitViolations: new Map()
};

// SQL injection patterns
const sqlInjectionPatterns = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)/i,
  /('|"|;|--|\/\*|\*\/|@@|@)/,
  /(\bOR\b.*=.*)/i,
  /(\bAND\b.*=.*)/i,
  /(CHAR\(|CONCAT\(|0x)/i,
  /(\bWAITFOR\b.*\bDELAY\b)/i,
  /(\bBENCHMARK\b\()/i,
  /(SLEEP\()/i
];

// XSS patterns
const xssPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe\b/gi,
  /<object\b/gi,
  /<embed\b/gi,
  /<form\b/gi,
  /eval\(/gi,
  /expression\(/gi,
  /url\(/gi
];

// Path traversal patterns
const pathTraversalPatterns = [
  /\.\.\//g,
  /\.\.\\/g,
  /%2e%2e%2f/gi,
  /%2e%2e\\/gi,
  /%252e%252e%252f/gi
];

// Security monitor middleware
const securityMonitor = (req, res, next) => {
  const startTime = Date.now();
  const ip = req.ip || req.connection.remoteAddress;
  
  // Check if IP is blocked
  if (threatStore.blockedIPs.has(ip)) {
    securityLogger.warn('Blocked IP attempt', {
      ip,
      url: req.originalUrl,
      method: req.method
    });
    return res.status(403).json({
      success: false,
      error: 'Accesso negato'
    });
  }
  
  // 1. SQL Injection Detection
  const requestBody = JSON.stringify(req.body);
  const queryString = JSON.stringify(req.query);
  const combinedInput = requestBody + queryString;
  
  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(combinedInput)) {
      logSecurityEvent('sql_injection', 'critical', {
        ip,
        url: req.originalUrl,
        method: req.method,
        pattern: pattern.toString(),
        input: combinedInput.substring(0, 200)
      });
      
      // Block IP after multiple attempts
      incrementThreat(ip, 'sql_injection');
      
      return res.status(400).json({
        success: false,
        error: 'Input non valido rilevato'
      });
    }
  }
  
  // 2. XSS Detection
  for (const pattern of xssPatterns) {
    if (pattern.test(combinedInput)) {
      logSecurityEvent('xss_attempt', 'high', {
        ip,
        url: req.originalUrl,
        method: req.method,
        pattern: pattern.toString()
      });
      
      incrementThreat(ip, 'xss');
      
      return res.status(400).json({
        success: false,
        error: 'Input non valido rilevato'
      });
    }
  }
  
  // 3. Path Traversal Detection
  for (const pattern of pathTraversalPatterns) {
    if (pattern.test(req.path)) {
      logSecurityEvent('path_traversal', 'high', {
        ip,
        url: req.originalUrl,
        path: req.path
      });
      
      incrementThreat(ip, 'path_traversal');
      
      return res.status(400).json({
        success: false,
        error: 'Percorso non valido'
      });
    }
  }
  
  // 4. Suspicious User-Agent Detection
  const userAgent = req.get('User-Agent') || '';
  const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab'];
  
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    logSecurityEvent('suspicious_user_agent', 'high', {
      ip,
      userAgent
    });
    
    incrementThreat(ip, 'suspicious_agent');
  }
  
  // 5. Unusual Request Size Detection
  const contentLength = parseInt(req.get('Content-Length') || '0');
  if (contentLength > 10 * 1024 * 1024) { // 10MB
    logSecurityEvent('large_request', 'medium', {
      ip,
      contentLength,
      url: req.originalUrl
    });
  }
  
  // 6. Monitor response for sensitive data leakage
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log slow requests
    if (duration > 5000) { // 5 seconds
      logSecurityEvent('slow_request', 'medium', {
        ip,
        url: req.originalUrl,
        duration: `${duration}ms`
      });
    }
    
    // Log server errors
    if (res.statusCode >= 500) {
      logSecurityEvent('server_error', 'high', {
        ip,
        url: req.originalUrl,
        statusCode: res.statusCode
      });
    }
  });
  
  next();
};

// Log security event
const logSecurityEvent = (type, severity, metadata) => {
  const event = {
    type,
    severity,
    timestamp: new Date().toISOString(),
    ...metadata
  };
  
  securityLogger.warn('Security Event', event);
  
  // Send alert for critical/high severity
  if (severity === 'critical' || severity === 'high') {
    sendSecurityAlert(event);
  }
};

// Send security alert
const sendSecurityAlert = (event) => {
  console.error('[SECURITY ALERT]', event);
  
  // In production: send to Slack, email, SMS, PagerDuty, etc.
  // Example: Slack webhook
  if (process.env.SLACK_WEBHOOK_URL) {
    fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 Security Alert: ${event.type}`,
        attachments: [{
          color: event.severity === 'critical' ? 'danger' : 'warning',
          fields: [
            { title: 'Type', value: event.type, short: true },
            { title: 'Severity', value: event.severity, short: true },
            { title: 'IP', value: event.ip, short: true },
            { title: 'URL', value: event.url, short: true },
            { title: 'Time', value: event.timestamp, short: false }
          ]
        }]
      })
    }).catch(console.error);
  }
};

// Increment threat counter for IP
const incrementThreat = (ip, type) => {
  if (!threatStore.suspiciousRequests.has(ip)) {
    threatStore.suspiciousRequests.set(ip, { count: 0, types: new Set() });
  }
  
  const threat = threatStore.suspiciousRequests.get(ip);
  threat.count++;
  threat.types.add(type);
  
  // Block IP after 5 threats
  if (threat.count >= 5) {
    threatStore.blockedIPs.add(ip);
    logSecurityEvent('ip_blocked', 'critical', {
      ip,
      reason: `Multiple threats detected: ${Array.from(threat.types).join(', ')}`
    });
    
    // Auto-unblock after 1 hour
    setTimeout(() => {
      threatStore.blockedIPs.delete(ip);
      threatStore.suspiciousRequests.delete(ip);
      logSecurityEvent('ip_unblocked', 'info', { ip });
    }, 60 * 60 * 1000);
  }
};

// Track failed login attempts
const trackFailedLogin = (ip, email) => {
  if (!threatStore.failedLogins.has(ip)) {
    threatStore.failedLogins.set(ip, { count: 0, emails: new Set(), firstAttempt: Date.now() });
  }
  
  const attempt = threatStore.failedLogins.get(ip);
  attempt.count++;
  attempt.emails.add(email);
  attempt.lastAttempt = Date.now();
  
  // Block IP after 10 failed attempts
  if (attempt.count >= 10) {
    threatStore.blockedIPs.add(ip);
    logSecurityEvent('ip_blocked_brute_force', 'critical', {
      ip,
      attempts: attempt.count,
      emails: Array.from(attempt.emails)
    });
    
    // Auto-unblock after 24 hours
    setTimeout(() => {
      threatStore.blockedIPs.delete(ip);
      threatStore.failedLogins.delete(ip);
    }, 24 * 60 * 60 * 1000);
  }
  
  // Alert after 5 failed attempts
  if (attempt.count === 5) {
    logSecurityEvent('brute_force_warning', 'high', {
      ip,
      attempts: attempt.count,
      emails: Array.from(attempt.emails)
    });
  }
};

// Get security statistics
const getSecurityStats = () => {
  return {
    blockedIPs: threatStore.blockedIPs.size,
    failedLogins: threatStore.failedLogins.size,
    suspiciousRequests: threatStore.suspiciousRequests.size,
    activeThreats: Array.from(threatStore.suspiciousRequests.entries()).map(([ip, data]) => ({
      ip,
      count: data.count,
      types: Array.from(data.types)
    }))
  };
};

// Reset threat store (for testing)
const resetThreatStore = () => {
  threatStore.failedLogins.clear();
  threatStore.suspiciousRequests.clear();
  threatStore.blockedIPs.clear();
  threatStore.rateLimitViolations.clear();
};

module.exports = {
  securityMonitor,
  securityLogger,
  logSecurityEvent,
  trackFailedLogin,
  getSecurityStats,
  resetThreatStore
};
