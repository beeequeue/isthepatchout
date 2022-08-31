/* eslint-disable @typescript-eslint/consistent-type-definitions */

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLIC_KEY: string
  readonly VITE_API_URL: string

  readonly VITE_FATHOM_SITE_ID: string

  readonly VITE_VAPID_PUBLIC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
