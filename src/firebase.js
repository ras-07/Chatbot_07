import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import the Auth service

const firebaseConfig = {
  apiKey: "AIzaSyAHrEtt6FI5mnZksau5UJzMqVBklqTgCac",
  authDomain: "chatbot-5596d.firebaseapp.com",
  projectId: "chatbot-5596d",
  storageBucket: "chatbot-5596d.firebasestorage.app",
  messagingSenderId: "363275897309",
  appId: "1:363275897309:web:79aaa063ae542203e04e34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and export it
export const auth = getAuth(app);
export default app;