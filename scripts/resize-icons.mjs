/**
 * Toffee Icon Resizer
 * 
 * Resizes the generated logo to 16x16, 32x32, 48x48, and 128x128 PNGs
 * for the browser extension manifest using the `sharp` package.
 * 
 * Usage: node scripts/resize-icons.mjs <source-image-path>
 */

import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZES = [16, 32, 48, 128, 192, 512];

const sourcePath = process.argv[2];
if (!sourcePath) {
  console.error('Usage: node scripts/resize-icons.mjs <source-image-path>');
  process.exit(1);
}

const extensionDir = resolve(__dirname, '..', 'packages', 'extension', 'public', 'icons');
const webDir = resolve(__dirname, '..', 'packages', 'web', 'public', 'icons');

import fs from 'fs';
if (!fs.existsSync(extensionDir)) fs.mkdirSync(extensionDir, { recursive: true });
if (!fs.existsSync(webDir)) fs.mkdirSync(webDir, { recursive: true });

for (const size of SIZES) {
  const isWebSize = size === 192 || size === 512;
  const outputPath = resolve(isWebSize ? webDir : extensionDir, `icon-${size}.png`);
  await sharp(sourcePath)
    .resize(size, size, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .png({ quality: 100 })
    .toFile(outputPath);
  console.log(`✅ icon-${size}.png (${size}x${size}) -> ${isWebSize ? 'web' : 'extension'}`);
}

console.log('\\n🎉 All icons generated successfully!');
