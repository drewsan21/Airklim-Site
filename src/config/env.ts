/**
 * Environment Configuration
 * Gestione variabili d'ambiente per AIRKLIM
 */

// Helper per ottenere variabili d'ambiente
const getEnvVar = (key: keyof ImportMetaEnv, defaultValue: string = ''): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env[key] as string) || defaultValue;
  }
  return defaultValue;
};

export const env = {
  // Node environment
  NODE_ENV: getEnvVar('MODE', 'development'),
  PROD: getEnvVar('PROD', 'false') === 'true',
  DEV: getEnvVar('DEV', 'true') === 'true',
  
  // API endpoints
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),
  WS_URL: getEnvVar('VITE_WS_URL', 'ws://localhost:3000'),
  
  // Security
  SLACK_SECURITY_WEBHOOK: getEnvVar('VITE_SLACK_SECURITY_WEBHOOK', ''),
  SIEM_ENDPOINT: getEnvVar('VITE_SIEM_ENDPOINT', ''),
  
  // External services
  GOOGLE_ANALYTICS_ID: getEnvVar('VITE_GOOGLE_ANALYTICS_ID', ''),
  FACEBOOK_PIXEL_ID: getEnvVar('VITE_FACEBOOK_PIXEL_ID', ''),
  
  // Feature flags
  ENABLE_ANALYTICS: getEnvVar('VITE_ENABLE_ANALYTICS', 'true') === 'true',
  ENABLE_MARKETING: getEnvVar('VITE_ENABLE_MARKETING', 'true') === 'true',
  ENABLE_CHAT: getEnvVar('VITE_ENABLE_CHAT', 'false') === 'true'
};

export default env;
