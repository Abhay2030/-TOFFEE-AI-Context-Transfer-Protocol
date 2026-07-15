import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAv8vfHll5jyKGOpcDdt3ZDMCBEsm7Zgp8",
  authDomain: "toffee-chat-transfer.firebaseapp.com",
  projectId: "toffee-chat-transfer",
  storageBucket: "toffee-chat-transfer.firebasestorage.app",
  messagingSenderId: "43583534571",
  appId: "1:43583534571:web:c651171f7172a4eb1a95ae",
  measurementId: "G-VBH4S7KQ62",
};

const GOOGLE_CLIENT_ID =
  "43583534571-9pfhr8h8akdv2f4hf91glud3df7qfgcj.apps.googleusercontent.com";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google using chrome.identity.launchWebAuthFlow.
 *
 * This is the correct approach for Manifest V3 extensions — it avoids
 * the signInWithPopup/signInWithRedirect methods which cannot work
 * inside extension popups due to MV3 CSP restrictions.
 *
 * Flow:
 * 1. Opens Google OAuth consent screen via chrome.identity
 * 2. Extracts the access_token from the redirect URL
 * 3. Creates a Firebase credential and signs in
 */
export async function signInWithGoogle(): Promise<void> {
  const redirectUrl = chrome.identity.getRedirectURL();

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirectUrl);
  authUrl.searchParams.set("response_type", "token");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("prompt", "consent");

  const responseUrl = await new Promise<string>((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      { url: authUrl.toString(), interactive: true },
      (callbackUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (!callbackUrl) {
          reject(new Error("No callback URL returned from auth flow"));
          return;
        }
        resolve(callbackUrl);
      }
    );
  });

  // Extract the access_token from the URL fragment
  const url = new URL(responseUrl);
  const hashParams = new URLSearchParams(url.hash.substring(1));
  const accessToken = hashParams.get("access_token");

  if (!accessToken) {
    throw new Error("No access token found in OAuth response");
  }

  // Create Firebase credential and sign in
  const credential = GoogleAuthProvider.credential(null, accessToken);
  await signInWithCredential(auth, credential);
}
