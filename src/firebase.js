// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// import {firestore} from 'firebase-functions'



const firebaseConfigForTest = {
  apiKey: "AIzaSyCA1Cw-qYJOsrUvu9l32hGijxYrmt7p0vg",
  authDomain: "susila-life-test.firebaseapp.com",
  projectId: "susila-life-test",
  storageBucket: "susila-life-test.appspot.com",
  messagingSenderId: "613256378659",
  appId: "1:613256378659:web:87b1e5406000d8ee8fb496",
  measurementId: "G-59ZWDRMEXP"
}

// const firebaseConfigForTest = {
//   apiKey: process.env.VITE_FIREBASE_API_KEY,
//   authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.VITE_FIREBASE_APP_ID,
//   measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
// };
// const firebaseConfigForCPPTest = {
//   apiKey: process.env.VITE_FIREBASE_CPP_API_KEY,
//   authDomain: process.env.VITE_FIREBASE_CPP_AUTH_DOMAIN,
//   projectId: process.env.VITE_FIREBASE_CPP_PROJECT_ID,
//   storageBucket: process.env.VITE_FIREBASE_CPP_STORAGE_BUCKET,
//   messagingSenderId: process.env.VITE_FIREBASE_CPP_MESSAGING_SENDER_ID,
//   appId: process.env.VITE_FIREBASE_CPP_APP_ID,
//   measurementId: process.env.VITE_FIREBASE_CPP_MEASUREMENT_ID,
// };


const firebaseConfigForCPPTest = {
  apiKey: 'AIzaSyDPsIDom5hk4cKHxfWUMuvomINzEKyXXuU',
  authDomain: 'content-provider-test1.firebaseapp.com',
  projectId: 'content-provider-test1',
  storageBucket: 'content-provider-test1.appspot.com',
  messagingSenderId: '949367516355',
  appId: '1:949367516355:web:2e4397e6f238e9052ec676',
  measurementId: 'G-1G8XYVWRHW',
}

// Initialize Firebase
// const app = initializeApp(firebaseConfigForProduction)
const app = initializeApp(firebaseConfigForTest)
export const storage = getStorage(app)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Initialize Firebase
// const app2 = initializeApp(firebaseConfigForCPPLive, 'Content-Provider-Test')
const app2 = initializeApp(firebaseConfigForCPPTest, 'Content-Provider-Test')
export const storage2 = getStorage(app2)
export const db2 = getFirestore(app2)
export const auth2 = getAuth(app2)

