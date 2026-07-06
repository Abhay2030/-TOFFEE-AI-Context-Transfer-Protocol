// ============================================================
// AES-256-GCM Encryption Utilities
// Uses Web Crypto API for browser compatibility.
// ============================================================

export const ENCRYPTION_SALT = 'toffee-salt-2024';

/**
 * Derives a 256-bit AES-GCM key from a user password and a salt using PBKDF2.
 */
export async function deriveEncryptionKey(password: string, saltStr: string = ENCRYPTION_SALT): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(saltStr),
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a base64 encoded string containing the IV and Ciphertext.
 * Format: `<iv_base64>:<ciphertext_base64>`
 */
export async function encryptData(plaintext: string, key: CryptoKey): Promise<string> {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    enc.encode(plaintext)
  );

  const ivBase64 = arrayBufferToBase64(iv);
  const ciphertextBase64 = arrayBufferToBase64(encryptedBuffer);

  return `${ivBase64}:${ciphertextBase64}`;
}

/**
 * Decrypts a previously encrypted base64 string back to plaintext.
 * Format expected: `<iv_base64>:<ciphertext_base64>`
 */
export async function decryptData(encryptedStr: string, key: CryptoKey): Promise<string> {
  const [ivBase64, ciphertextBase64] = encryptedStr.split(':');
  
  if (!ivBase64 || !ciphertextBase64) {
    throw new Error('Invalid encrypted data format.');
  }

  const iv = base64ToArrayBuffer(ivBase64);
  const ciphertext = base64ToArrayBuffer(ciphertextBase64);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv),
    },
    key,
    ciphertext
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}

// ── ArrayBuffer / Base64 Helpers ─────────────────────────────

export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
