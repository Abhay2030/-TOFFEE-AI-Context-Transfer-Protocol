const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = path.join(__dirname, '../dist');
const outDir = path.join(__dirname, '../release');
const outFile = path.join(outDir, 'toffee-extension-edge.zip');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const output = fs.createWriteStream(outFile);
const archive = new archiver.ZipArchive({
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  console.log(`Successfully zipped ${archive.pointer()} bytes.`);
  console.log(`File created at: ${outFile}`);
  console.log('You can now upload this .zip file to the Microsoft Edge Add-ons Store!');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Append files from the dist directory, putting them at the root of the archive
archive.directory(distDir, false);

archive.finalize();
