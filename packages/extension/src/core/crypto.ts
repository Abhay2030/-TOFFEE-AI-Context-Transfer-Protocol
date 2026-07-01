// ============================================================
// Toffee Core — Cryptography & HMAC Utilities
// ============================================================

export async function generateHMAC(bundleData: string, secretKey: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    keyMaterial,
    enc.encode(bundleData)
  );

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyHMAC(bundleData: string, signatureHex: string, secretKey: string): Promise<boolean> {
  const generated = await generateHMAC(bundleData, secretKey);
  // Constant time comparison to prevent timing attacks
  if (generated.length !== signatureHex.length) return false;
  let mismatch = 0;
  for (let i = 0; i < generated.length; ++i) {
    mismatch |= (generated.charCodeAt(i) ^ signatureHex.charCodeAt(i));
  }
  return mismatch === 0;
}
