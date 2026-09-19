/**
 * AIRKLIM Security Configuration
 * Configurazione completa per la sicurezza dell'applicazione
 */

// ===== 1. HTTPS CONFIGURATION =====
export const HTTPSConfig = {
  // Forza redirect HTTPS in produzione
  forceHTTPS: import.meta.env.PROD,
  
  // HSTS (HTTP Strict Transport Security)
  hsts: {
    maxAge: 31536000, // 1 anno in secondi
    includeSubDomains: true,
    preload: true
  },
  
  // Verifica certificato SSL
  verifySSL: true,
  
  // Redirect HTTP to HTTPS
  redirectHTTP: true
};

// ===== 2. CORS CONFIGURATION =====
export const CORSConfig = {
  // Origini permesse
  allowedOrigins: [
    'https://airklim.it',
    'https://www.airklim.it',
    'https://api.airklim.it',
    import.meta.env.DEV && 'http://localhost:3000',
    import.meta.env.DEV && 'http://localhost:5173'
  ].filter(Boolean),
  
  // Metodi HTTP permessi
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  // Headers permessi
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'Accept',
    'Origin'
  ],
  
  // Headers esposti
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset'
  ],
  
  // Credenziali (cookies, authorization headers)
  credentials: true,
  
  // Max age per preflight requests
  maxAge: 86400 // 24 ore
};

// ===== 3. RATE LIMITING CONFIGURATION =====
export const RateLimitConfig = {
  // Limiti generali
  general: {
    windowMs: 15 * 60 * 1000, // 15 minuti
    maxRequests: 100, // max 100 richieste per finestra
    message: 'Troppe richieste, riprova più tardi'
  },
  
  // Limiti per autenticazione
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minuti
    maxRequests: 5, // max 5 tentativi login
    message: 'Troppi tentativi di login, riprova tra 15 minuti'
  },
  
  // Limiti per API
  api: {
    windowMs: 1 * 60 * 1000, // 1 minuto
    maxRequests: 60, // max 60 richieste al minuto
    message: 'Limite API superato'
  },
  
  // Limiti per upload
  upload: {
    windowMs: 60 * 60 * 1000, // 1 ora
    maxRequests: 10, // max 10 upload all'ora
    message: 'Limite upload superato'
  },
  
  // Limiti per password reset
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 ora
    maxRequests: 3, // max 3 reset all'ora
    message: 'Troppi tentativi di reset password'
  },
  
  // Headers per rate limiting
  headers: {
    limit: 'X-RateLimit-Limit',
    remaining: 'X-RateLimit-Remaining',
    reset: 'X-RateLimit-Reset'
  }
};

// ===== 4. INPUT VALIDATION CONFIGURATION =====
export const ValidationConfig = {
  // Email validation
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    maxLength: 254,
    message: 'Email non valida'
  },
  
  // Password validation
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    message: 'La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale'
  },
  
  // Phone validation (Italian format)
  phone: {
    pattern: /^(\+39)?\s?3\d{2}\s?\d{6,7}$/,
    message: 'Numero di telefono non valido'
  },
  
  // VAT number validation (Italian P.IVA)
  vatNumber: {
    pattern: /^IT?\d{11}$/,
    message: 'Partita IVA non valida'
  },
  
  // Fiscal code validation (Italian CF)
  fiscalCode: {
    pattern: /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/,
    message: 'Codice fiscale non valido'
  },
  
  // Name validation
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    message: 'Nome non valido'
  },
  
  // Address validation
  address: {
    minLength: 5,
    maxLength: 200,
    message: 'Indirizzo non valido'
  },
  
  // CAP validation (Italian)
  cap: {
    pattern: /^\d{5}$/,
    message: 'CAP non valido'
  },
  
  // File upload validation
  fileUpload: {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxFiles: 5,
    message: 'File non valido'
  }
};

// ===== 5. CSRF PROTECTION CONFIGURATION =====
export const CSRFConfig = {
  // Abilita protezione CSRF
  enabled: true,
  
  // Nome del token
  tokenName: 'X-CSRF-Token',
  
  // Nome del cookie
  cookieName: 'csrf_token',
  
  // Durata del token (in secondi)
  tokenLifetime: 3600, // 1 ora
  
  // Ignora questi metodi
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  
  // Ignora questi path
  ignorePaths: [
    '/api/health',
    '/api/public',
    '/webhook'
  ],
  
  // Genera token sicuro
  generateToken: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
};

// ===== 6. CONTENT SECURITY POLICY =====
export const CSPConfig = {
  // Content Security Policy headers
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Necessario per React
      "'unsafe-eval'", // Necessario per development
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://www.facebook.com',
      'https://connect.facebook.net'
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Necessario per Tailwind CSS
      'https://fonts.googleapis.com'
    ],
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://images.unsplash.com',
      'https://image.qwenlm.ai'
    ],
    fontSrc: [
      "'self'",
      'data:',
      'https://fonts.gstatic.com'
    ],
    connectSrc: [
      "'self'",
      'https://api.airklim.it',
      'https://www.google-analytics.com',
      'https://www.facebook.com',
      'wss:' // WebSocket
    ],
    mediaSrc: [
      "'self'",
      'blob:'
    ],
    objectSrc: ["'none'"],
    frameSrc: [
      "'self'",
      'https://www.youtube.com',
      'https://www.youtube-nocookie.com',
      'https://player.vimeo.com'
    ],
    workerSrc: [
      "'self'",
      'blob:'
    ],
    manifestSrc: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    baseURI: ["'self'"],
    upgradeInsecureRequests: true
  },
  
  // Report URI per violazioni CSP
  reportUri: '/api/csp-violation-report',
  
  // Modalità report-only (non blocca, solo report)
  reportOnly: import.meta.env.DEV
};

// ===== 7. DATA SANITIZATION CONFIGURATION =====
export const SanitizationConfig = {
  // Rimuovi script tags
  removeScripts: true,
  
  // Rimuovi event handlers
  removeEventHandlers: true,
  
  // Rimuovi javascript: URLs
  removeJavascriptURLs: true,
  
  // Permetti solo questi tag HTML
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'
  ],
  
  // Permetti solo questi attributi
  allowedAttributes: {
    'a': ['href', 'title', 'target'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    '*': ['class', 'id']
  },
  
  // Sanitizza input form
  sanitizeFormInputs: true,
  
  // Sanitizza JSON responses
  sanitizeJSONResponses: true,
  
  // Escape HTML entities
  escapeHTML: true
};

// ===== 8. AUDIT LOG CONFIGURATION =====
export const AuditLogConfig = {
  // Abilita audit logging
  enabled: true,
  
  // Logga questi eventi
  events: {
    // Autenticazione
    login: true,
    logout: true,
    loginFailed: true,
    passwordChanged: true,
    passwordReset: true,
    
    // Utenti
    userCreated: true,
    userUpdated: true,
    userDeleted: true,
    userVerified: true,
    
    // Ordini
    orderCreated: true,
    orderUpdated: true,
    orderDeleted: true,
    orderStatusChanged: true,
    paymentProcessed: true,
    refundProcessed: true,
    
    // Prodotti
    productCreated: true,
    productUpdated: true,
    productDeleted: true,
    productStockChanged: true,
    
    // Admin
    adminAction: true,
    settingsChanged: true,
    permissionChanged: true,
    
    // Sicurezza
    suspiciousActivity: true,
    rateLimitExceeded: true,
    cspViolation: true,
    csrfViolation: true
  },
  
  // Includi questi dati nel log
  includeData: {
    userId: true,
    userEmail: true,
    ipAddress: true,
    userAgent: true,
    timestamp: true,
    action: true,
    resource: true,
    resourceId: true,
    changes: true,
    metadata: true
  },
  
  // Escludi dati sensibili
  excludeData: [
    'password',
    'creditCard',
    'cvv',
    'ssn',
    'token',
    'secret'
  ],
  
  // Retention period (giorni)
  retentionDays: 365,
  
  // Archiviazione
  storage: {
    type: 'database', // 'database' | 'file' | 'cloud'
    compress: true,
    encrypt: true
  }
};

// ===== 9. DATABASE BACKUP CONFIGURATION =====
export const BackupConfig = {
  // Abilita backup automatici
  enabled: true,
  
  // Frequenza backup
  schedule: {
    full: '0 2 * * 0', // Ogni domenica alle 2:00
    incremental: '0 2 * * 1-6', // Lunedì-Sabato alle 2:00
    realTime: false // Backup in tempo reale
  },
  
  // Retention policy
  retention: {
    daily: 7, // Mantieni 7 backup giornalieri
    weekly: 4, // Mantieni 4 backup settimanali
    monthly: 12, // Mantieni 12 backup mensili
    yearly: 3 // Mantieni 3 backup annuali
  },
  
  // Destinazione backup
  destination: {
    type: 'cloud', // 'local' | 'cloud' | 'both'
    cloud: {
      provider: 'aws', // 'aws' | 'gcp' | 'azure'
      bucket: 'airklim-backups',
      region: 'eu-south-1',
      encryption: 'AES-256'
    },
    local: {
      path: '/backups/airklim',
      compression: 'gzip'
    }
  },
  
  // Cosa includere nel backup
  include: {
    database: true,
    uploadedFiles: true,
    configuration: true,
    logs: false
  },
  
  // Notifiche
  notifications: {
    onSuccess: true,
    onFailure: true,
    email: ['admin@airklim.it', 'security@airklim.it'],
    slack: true
  },
  
  // Verifica integrità
  verifyIntegrity: true,
  
  // Test restore periodico
  testRestore: {
    enabled: true,
    frequency: 'monthly'
  }
};

// ===== 10. SECURITY MONITORING CONFIGURATION =====
export const SecurityMonitoringConfig = {
  // Abilita monitoring
  enabled: true,
  
  // Monitora questi eventi
  events: {
    // Tentativi di accesso sospetti
    suspiciousLoginAttempts: {
      enabled: true,
      threshold: 5, // 5 tentativi falliti
      timeWindow: 15 * 60 * 1000, // 15 minuti
      action: 'block' // 'block' | 'alert' | 'log'
    },
    
    // Accessi da location sospette
    suspiciousLocations: {
      enabled: true,
      allowedCountries: ['IT', 'EU'],
      action: 'alert'
    },
    
    // Accessi da dispositivi sconosciuti
    unknownDevices: {
      enabled: true,
      action: 'alert'
    },
    
    // Modifiche sospette ai dati
    suspiciousDataChanges: {
      enabled: true,
      action: 'alert'
    },
    
    // Attacchi SQL injection
    sqlInjection: {
      enabled: true,
      action: 'block'
    },
    
    // Attacchi XSS
    xss: {
      enabled: true,
      action: 'block'
    },
    
    // Attacchi CSRF
    csrf: {
      enabled: true,
      action: 'block'
    },
    
    // Attacchi DDoS
    ddos: {
      enabled: true,
      threshold: 1000, // 1000 richieste al minuto
      action: 'block'
    }
  },
  
  // Alert configuration
  alerts: {
    email: {
      enabled: true,
      recipients: ['security@airklim.it', 'admin@airklim.it'],
      severity: ['high', 'critical']
    },
    slack: {
      enabled: true,
      webhook: import.meta.env.VITE_SLACK_SECURITY_WEBHOOK || '',
      severity: ['medium', 'high', 'critical']
    },
    sms: {
      enabled: true,
      recipients: ['+393331234567'], // Numero admin
      severity: ['critical']
    }
  },
  
  // Dashboard security
  dashboard: {
    enabled: true,
    realTimeUpdates: true,
    metrics: [
      'failedLoginAttempts',
      'suspiciousActivities',
      'blockedRequests',
      'activeSessions',
      'securityEvents'
    ]
  },
  
  // Reporting
  reporting: {
    daily: true,
    weekly: true,
    monthly: true,
    format: 'pdf'
  },
  
  // Integrazione con SIEM
  siem: {
    enabled: true,
    provider: 'splunk', // 'splunk' | 'elastic' | 'azure'
    endpoint: import.meta.env.VITE_SIEM_ENDPOINT || ''
  }
};

// ===== SECURITY UTILS =====
export const SecurityUtils = {
  /**
   * Genera un token CSRF sicuro
   */
  generateCSRFToken: (): string => {
    return CSRFConfig.generateToken();
  },
  
  /**
   * Valida un'email
   */
  validateEmail: (email: string): boolean => {
    return ValidationConfig.email.pattern.test(email) && 
           email.length <= ValidationConfig.email.maxLength;
  },
  
  /**
   * Valida una password
   */
  validatePassword: (password: string): { valid: boolean; message?: string } => {
    const config = ValidationConfig.password;
    
    if (password.length < config.minLength) {
      return { valid: false, message: config.message };
    }
    
    if (config.requireUppercase && !/[A-Z]/.test(password)) {
      return { valid: false, message: config.message };
    }
    
    if (config.requireLowercase && !/[a-z]/.test(password)) {
      return { valid: false, message: config.message };
    }
    
    if (config.requireNumbers && !/\d/.test(password)) {
      return { valid: false, message: config.message };
    }
    
    if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: config.message };
    }
    
    return { valid: true };
  },
  
  /**
   * Sanitizza una stringa HTML
   */
  sanitizeHTML: (html: string): string => {
    if (!SanitizationConfig.removeScripts) return html;
    
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  },
  
  /**
   * Genera un nonce per CSP
   */
  generateNonce: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  },
  
  /**
   * Verifica se un IP è nella blacklist
   */
  isIPBlacklisted: (ip: string): boolean => {
    // Implementare logica blacklist
    return false;
  },
  
  /**
   * Logga un evento di sicurezza
   */
  logSecurityEvent: (event: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    metadata?: any;
  }) => {
    console.warn(`[SECURITY] ${event.severity.toUpperCase()}: ${event.message}`, event.metadata);
    // Inviare a sistema di monitoring
  }
};

export default {
  HTTPSConfig,
  CORSConfig,
  RateLimitConfig,
  ValidationConfig,
  CSRFConfig,
  CSPConfig,
  SanitizationConfig,
  AuditLogConfig,
  BackupConfig,
  SecurityMonitoringConfig,
  SecurityUtils
};
