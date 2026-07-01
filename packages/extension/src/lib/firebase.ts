import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAv8vfHll5jyKGOpcDdt3ZDMCBEsm7Zgp8",
  authDomain: "toffee-chat-transfer.firebaseapp.com",
  projectId: "toffee-chat-transfer",
  storageBucket: "toffee-chat-transfer.firebasestorage.app",
  messagingSenderId: "43583534571",
  appId: "1:43583534571:web:c651171f7172a4eb1a95ae",
  measurementId: "G-VBH4S7KQ62"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
