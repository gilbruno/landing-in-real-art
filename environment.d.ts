// environment.d.ts
declare namespace NodeJS {
    export interface ProcessEnv {
        NEXT_PUBLIC_FIREBASE_API_KEY: string
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
        NEXT_PUBLIC_FIREBASE_APP_ID: string
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string
        NEXT_PUBLIC_FIREBASE_IMAGES_TOKEN: string
        NEXT_PUBLIC_SUPABASE_PROJECT_URL: string
        NEXT_PUBLIC_SUPABASE_API_KEY: string
        NEXT_PUBLIC_CHAIN: string
        NEXT_PUBLIC_CHAIN_ID: number
      // Define more variables as needed
    }
  }