import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'
import 'firebase/storage'
import { getStorage } from 'firebase/storage'


const bucketUrl = `gs://${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  }

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app, bucketUrl)
export { db, storage  }

