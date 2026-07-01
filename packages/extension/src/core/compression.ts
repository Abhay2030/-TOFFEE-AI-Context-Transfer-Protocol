// ============================================================
// Toffee Core — GZIP Compression Utilities
// ============================================================

export async function gzipString(input: string): Promise<Uint8Array> {
  const stream = new Blob([input], { type: 'application/json' }).stream();
  const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
  const response = new Response(compressedStream);
  const blob = await response.blob();
  return new Uint8Array(await blob.arrayBuffer());
}

export async function gunzipString(compressed: Uint8Array): Promise<string> {
  const stream = new Blob([compressed as any]).stream();
  const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
  const response = new Response(decompressedStream);
  const blob = await response.blob();
  return blob.text();
}

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
