/**
 * Security Middleware Implementation
 * Implementazione middleware di sicurezza per AIRKLIM
 */

import SecurityConfig, { SecurityUtils } from './SecurityConfig';

// ===== SECURITY MIDDLEWARE CLASS =====
export class SecurityMiddleware {
  private static instance: SecurityMiddleware;
  
  private constructor() {}
  
  static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  /**
   * 1. HTTPS Enforcement Middleware
   */
  enforceHTTPS(): void {
    if (SecurityConfig.HTTPSConfig.forceHTTPS && window.location.protocol === 'http:') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }

  /**
   * 2. CORS Validation
   */
  validateCORS(origin: string): boolean {
    return SecurityConfig.CORSConfig.allowedOrigins.includes(origin);
  }

  /**
   * 3. Rate Limiting Implementation
   */
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();

  checkRateLimit(endpoint: string, limit: 'general' | 'auth' | 'api' | 'upload' | 'passwordReset' = 'general'): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const config = SecurityConfig.RateLimitConfig[limit];
    const now = Date.now();
    const key = `${endpoint}_${limit}`;
    
    let record = this.rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + config.windowMs
      };
      this.rateLimitStore.set(key, record);
    }
    
    record.count++;
    
    const allowed = record.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - record.count);
    
    return {
      allowed,
      remaining,
      resetTime: record.resetTime
    };
  }

  /**
   * 4. Input Validation
   */
  validateInput(type: string, value: string): { valid: boolean; message?: string } {
    const config = SecurityConfig.ValidationConfig[type as keyof typeof SecurityConfig.ValidationConfig];
    
    if (!config) {
      return { valid: true };
    }
    
    if ('pattern' in config && config.pattern) {
      if (!config.pattern.test(value)) {
        return { valid: false, message: config.message };
      }
    }
    
    if ('minLength' in config && config.minLength && value.length < config.minLength) {
      return { valid: false, message: config.message };
    }
    
    if ('maxLength' in config && config.maxLength && value.length > config.maxLength) {
      return { valid: false, message: config.message };
    }
    
    return { valid: true };
  }

  /**
   * 5. CSRF Protection
   */
  private csrfToken: string | null = null;

  generateCSRFToken(): string {
    this.csrfToken = SecurityUtils.generateCSRFToken();
    
    // Salva il token in un cookie
    document.cookie = `${SecurityConfig.CSRFConfig.cookieName}=${this.csrfToken}; path=/; Secure; SameSite=Strict`;
    
    return this.csrfToken;
  }

  validateCSRFToken(token: string): boolean {
    return this.csrfToken === token;
  }

  getCSRFToken(): string | null {
    if (!this.csrfToken) {
      this.generateCSRFToken();
    }
    return this.csrfToken;
  }

  /**
   * 6. Content Security Policy
   */
  generateCSPHeader(): string {
    const directives = SecurityConfig.CSPConfig.directives;
    const headerParts: string[] = [];
    
    for (const [directive, values] of Object.entries(directives)) {
      if (Array.isArray(values)) {
        headerParts.push(`${directive} ${values.join(' ')}`);
      } else if (values === true) {
        headerParts.push(directive);
      }
    }
    
    if (SecurityConfig.CSPConfig.reportUri) {
      headerParts.push(`report-uri ${SecurityConfig.CSPConfig.reportUri}`);
    }
    
    return headerParts.join('; ');
  }

  /**
   * 7. Data Sanitization
   */
  sanitizeInput(input: string): string {
    let sanitized = input;
    
    // Rimuovi script tags
    if (SecurityConfig.SanitizationConfig.removeScripts) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    
    // Rimuovi event handlers
    if (SecurityConfig.SanitizationConfig.removeEventHandlers) {
      sanitized = sanitized.replace(/\son\w+="[^"]*"/gi, '');
    }
    
    // Rimuovi javascript: URLs
    if (SecurityConfig.SanitizationConfig.removeJavascriptURLs) {
      sanitized = sanitized.replace(/javascript:/gi, '');
    }
    
    // Escape HTML entities
    if (SecurityConfig.SanitizationConfig.escapeHTML) {
      sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
    
    return sanitized;
  }

  /**
   * 8. Audit Logging
   */
  private auditLogs: Array<{
    timestamp: string;
    event: string;
    userId?: string;
    action: string;
    resource?: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }> = [];

  logAuditEvent(event: {
    event: string;
    userId?: string;
    action: string;
    resource?: string;
    metadata?: any;
  }): void {
    if (!SecurityConfig.AuditLogConfig.enabled) return;
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event.event,
      userId: event.userId,
      action: event.action,
      resource: event.resource,
      metadata: event.metadata,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };
    
    this.auditLogs.push(logEntry);
    
    // In produzione: inviare a backend
    console.log('[AUDIT LOG]', logEntry);
    
    // Limita la dimensione del log in memoria
    if (this.auditLogs.length > 1000) {
      this.auditLogs.shift();
    }
  }

  getAuditLogs(): typeof this.auditLogs {
    return [...this.auditLogs];
  }

  /**
   * 9. Backup Management
   */
  async triggerBackup(type: 'full' | 'incremental' = 'full'): Promise<{
    success: boolean;
    backupId: string;
    timestamp: string;
    size?: number;
  }> {
    const backupId = `backup_${Date.now()}_${type}`;
    
    console.log(`[BACKUP] Starting ${type} backup: ${backupId}`);
    
    // In produzione: chiamare API backend per triggerare backup
    // const response = await fetch('/api/backup/trigger', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type, backupId })
    // });
    
    // Simulazione per ora
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = {
      success: true,
      backupId,
      timestamp: new Date().toISOString(),
      size: Math.floor(Math.random() * 1000) + 500 // MB simulati
    };
    
    this.logAuditEvent({
      event: 'backup_triggered',
      action: 'create',
      resource: 'backup',
      metadata: result
    });
    
    console.log('[BACKUP] Backup completed:', result);
    
    return result;
  }

  /**
   * 10. Security Monitoring
   */
  private securityEvents: Array<{
    timestamp: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    metadata?: any;
  }> = [];

  logSecurityEvent(event: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    metadata?: any;
  }): void {
    if (!SecurityConfig.SecurityMonitoringConfig.enabled) return;
    
    const securityEvent = {
      timestamp: new Date().toISOString(),
      ...event
    };
    
    this.securityEvents.push(securityEvent);
    
    // Log in console
    const logMethod = event.severity === 'critical' ? 'error' : 
                      event.severity === 'high' ? 'warn' : 'log';
    console[logMethod](`[SECURITY] ${event.severity.toUpperCase()}: ${event.message}`, event.metadata);
    
    // Invia alert se necessario
    this.sendSecurityAlert(event);
    
    // Limita la dimensione del log
    if (this.securityEvents.length > 1000) {
      this.securityEvents.shift();
    }
  }

  private sendSecurityAlert(event: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
  }): void {
    const alerts = SecurityConfig.SecurityMonitoringConfig.alerts;
    
    // Email alert
    if (alerts.email.enabled && alerts.email.severity.includes(event.severity)) {
      console.log('[ALERT] Email sent to:', alerts.email.recipients);
      // In produzione: chiamare API per inviare email
    }
    
    // Slack alert
    if (alerts.slack.enabled && alerts.slack.severity.includes(event.severity)) {
      console.log('[ALERT] Slack notification sent');
      // In produzione: chiamare webhook Slack
    }
    
    // SMS alert
    if (alerts.sms.enabled && alerts.sms.severity.includes(event.severity)) {
      console.log('[ALERT] SMS sent to:', alerts.sms.recipients);
      // In produzione: chiamare API per inviare SMS
    }
  }

  getSecurityEvents(): typeof this.securityEvents {
    return [...this.securityEvents];
  }

  /**
   * Utility: Get Client IP
   */
  private getClientIP(): string {
    // In produzione: ottenere IP da header o API
    return '0.0.0.0'; // Placeholder
  }

  /**
   * Initialize all security middleware
   */
  initialize(): void {
    console.log('[SECURITY] Initializing security middleware...');
    
    // 1. Enforce HTTPS
    this.enforceHTTPS();
    
    // 2. Generate CSRF token
    this.generateCSRFToken();
    
    // 3. Log initialization
    this.logAuditEvent({
      event: 'security_initialized',
      action: 'initialize',
      resource: 'security_middleware'
    });
    
    console.log('[SECURITY] Security middleware initialized successfully');
  }
}

// Export singleton instance
export const securityMiddleware = SecurityMiddleware.getInstance();

// Auto-initialize on import
securityMiddleware.initialize();

export default securityMiddleware;
