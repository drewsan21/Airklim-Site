/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string
  readonly DEV: string
  readonly PROD: string
  readonly SSR: string
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_SLACK_SECURITY_WEBHOOK: string
  readonly VITE_SIEM_ENDPOINT: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_FACEBOOK_PIXEL_ID: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_MARKETING: string
  readonly VITE_ENABLE_CHAT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
