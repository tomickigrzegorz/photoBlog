import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "../dist");
const imagesDir = path.join(distDir, "images");

if (!fs.existsSync(imagesDir)) {
  console.log("No dist/images directory found, skipping.");
  process.exit(0);
}

// Collect all image URLs referenced in HTML files
const usedImages = new Set();
const htmlFiles = fs.readdirSync(distDir).filter((f) => f.endsWith(".html"));

for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(path.join(distDir, htmlFile), "utf-8");
  const matches = content.matchAll(/\/images\/[^"'\s>]+/g);
  for (const [url] of matches) {
    usedImages.add(url);
  }
}

console.log(`Found ${usedImages.size} referenced images across ${htmlFiles.length} HTML files.`);

// Walk dist/images/ and delete unreferenced files
let deleted = 0;
let kept = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      // Remove empty directories
      if (fs.readdirSync(fullPath).length === 0) {
        fs.rmdirSync(fullPath);
      }
    } else {
      const url = fullPath.replace(distDir, "").replace(/\\/g, "/");
      if (usedImages.has(url)) {
        kept++;
      } else {
        fs.unlinkSync(fullPath);
        deleted++;
      }
    }
  }
}

walk(imagesDir);

console.log(`Done. Kept: ${kept}, deleted: ${deleted} files.`);
