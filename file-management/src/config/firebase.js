import admin from "firebase-admin"
import { readFileSync } from "fs"
import dotenv from "dotenv"

dotenv.config(); 
console.log("FIREBASE_KEY_PATH:", process.env.FIREBASE_KEY_PATH)

const serviceAccountPath = process.env.FIREBASE_KEY_PATH
if (!serviceAccountPath) {
  throw new Error("FIREBASE_KEY_PATH environment variable is not set.")
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "file-management-3bd51.firebasestorage.app",
})

const db = admin.firestore()
const bucket = admin.storage().bucket()

export { db, bucket }
