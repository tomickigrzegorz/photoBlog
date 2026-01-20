const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../sources/data");
const outputDir = path.join(__dirname, "../src/content/articles");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all JSON files except index.json
const jsonFiles = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith(".json") && f !== "index.json");

// Load index.json to get thumbnail info
const indexData = JSON.parse(
  fs.readFileSync(path.join(dataDir, "index.json"), "utf-8"),
);

// Create map of href -> thumbnail info from index
const thumbnailMap = {};
indexData.items.forEach((item) => {
  const slug = item.href.replace(".html", "");
  thumbnailMap[slug] = {
    img: item.img,
    alt: item.alt,
    date: item.date,
  };
});

// Convert HTML to Markdown
function htmlToMarkdown(html) {
  if (!html) return "";

  return (
    html
      // Convert <br> and <br /> to newlines
      .replace(/<br\s*\/?>/gi, "\n")
      // Convert links
      .replace(/<a\s+href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/gi, "[$2]($1)")
      // Remove any remaining HTML tags
      .replace(/<[^>]+>/g, "")
      // Fix multiple newlines
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

// Extract folder name from path like "./images/chiny/" or "images/chiny/"
function extractFolder(itemPath) {
  if (!itemPath) return null;
  const match = itemPath.match(/\.?\/?\/?images\/([^/]+)\/?/);
  return match ? match[1] : null;
}

// Parse date string to ISO format
function parseDate(dateStr) {
  if (!dateStr) return null;

  // Try to extract first date from formats like "07-17.10.2016" or "2-3.06.2018"
  const match = dateStr.match(/(\d{1,2})[-.](\d{1,2})\.(\d{4})/);
  if (match) {
    const day = match[1].padStart(2, "0");
    const month = match[2].padStart(2, "0");
    const year = match[3];
    return `${year}-${month}-${day}`;
  }

  // Try format "dd.mm.yyyy"
  const simpleMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (simpleMatch) {
    const day = simpleMatch[1].padStart(2, "0");
    const month = simpleMatch[2].padStart(2, "0");
    const year = simpleMatch[3];
    return `${year}-${month}-${day}`;
  }

  return null;
}

// Escape YAML string values
function escapeYamlString(str) {
  if (!str) return '""';
  // If string contains special chars, wrap in quotes and escape internal quotes
  if (str.includes(":") || str.includes('"') || str.includes("'") || str.includes("\n") || str.includes("#")) {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return str;
}

// Convert single JSON file to Markdown
function convertJsonToMd(filename) {
  const slug = filename.replace(".json", "");
  const jsonPath = path.join(dataDir, filename);
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  const { head, body, schema } = data;
  const thumbnailInfo = thumbnailMap[slug] || {};

  // Determine folder from first non-empty image item
  let folder = null;
  if (body?.items?.length > 0) {
    for (const item of body.items) {
      // Try path first, then img field for full path format
      folder = extractFolder(item.path) || extractFolder(item.img);
      if (folder) break;
    }
  }

  // Build images array from body.items
  const images = [];
  if (body?.items) {
    for (const item of body.items) {
      // Skip empty images
      if (!item.img) continue;

      // Extract filename - handle both "IMG_123.jpg" and "./images/folder/IMG_123.jpg" formats
      let filename = item.img;
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      images.push({
        filename: filename,
        alt: item.alt || "",
        caption: item.text ? htmlToMarkdown(item.text) : "",
        width: item.width || null,
        height: item.height || null,
      });
    }
  }

  // Build YAML frontmatter string
  let yaml = "---\n";
  yaml += `title: ${escapeYamlString(head?.title || body?.title || slug)}\n`;

  // body.title is the display title shown on the page (may include date)
  if (body?.title && body.title !== head?.title) {
    yaml += `displayTitle: ${escapeYamlString(body.title)}\n`;
  }

  if (head?.description) {
    yaml += `description: ${escapeYamlString(head.description)}\n`;
  }

  const date = parseDate(body?.date);
  if (date) {
    yaml += `date: ${date}\n`;
  }

  if (body?.date) {
    yaml += `dateDisplay: ${escapeYamlString(body.date)}\n`;
  }

  if (schema?.datePublished) {
    yaml += `publishedDate: ${schema.datePublished}\n`;
  }

  if (schema?.dateModified) {
    yaml += `modifiedDate: ${schema.dateModified}\n`;
  }

  yaml += `author: ${schema?.author || "Grzegorz Tomicki"}\n`;

  if (thumbnailInfo.img) {
    yaml += `thumbnail: ${thumbnailInfo.img.replace("./images/", "")}\n`;
  }

  if (thumbnailInfo.alt) {
    yaml += `thumbnailAlt: ${escapeYamlString(thumbnailInfo.alt)}\n`;
  }

  if (folder) {
    yaml += `folder: ${folder}\n`;
  }

  // Add images array
  if (images.length > 0) {
    yaml += "images:\n";
    for (const img of images) {
      yaml += `  - filename: ${escapeYamlString(img.filename)}\n`;
      if (img.alt) {
        yaml += `    alt: ${escapeYamlString(img.alt)}\n`;
      }
      if (img.caption) {
        yaml += `    caption: ${escapeYamlString(img.caption)}\n`;
      }
      if (img.width) {
        yaml += `    width: ${img.width}\n`;
      }
      if (img.height) {
        yaml += `    height: ${img.height}\n`;
      }
    }
  }

  yaml += "---\n\n";

  // Build content - only the intro text, not images
  let content = "";

  // Add main text
  if (body?.text) {
    content += htmlToMarkdown(body.text) + "\n";
  }

  const markdown = yaml + content.trim() + "\n";

  // Write markdown file
  const mdPath = path.join(outputDir, `${slug}.md`);
  fs.writeFileSync(mdPath, markdown, "utf-8");

  console.log(`✓ ${filename} → ${slug}.md (${images.length} images)`);
}

// Convert all JSON files
console.log(`Converting ${jsonFiles.length} JSON files to Markdown...\n`);

for (const file of jsonFiles) {
  try {
    convertJsonToMd(file);
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log(`\nDone! Files saved to ${outputDir}`);
