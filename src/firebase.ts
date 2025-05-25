import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBSYuCVb_v9kUwdGk2l4RavQc-kHomvnFc',
  authDomain: 'test-5f1fc.firebaseapp.com',
  databaseURL: 'https://test-5f1fc-default-rtdb.firebaseio.com',
  projectId: 'test-5f1fc',
  storageBucket: 'test-5f1fc.appspot.com',
  messagingSenderId: '884914487729',
  appId: '1:884914487729:web:1119c5377de60e6c387d90',
  measurementId: 'G-7LRBR47LJZ'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
