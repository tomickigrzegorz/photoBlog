import { writeFileSync } from 'fs';
import path from 'path';

const dateModified = new Date().toISOString().slice(0, 10);

function escapeYamlString(str) {
  if (!str) return '""';
  if (str.includes(':') || str.includes('"') || str.includes("'") || str.includes('\n') || str.includes('#') || str.includes('<')) {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return str;
}

export function saveMarkdown(options, root) {
  const {
    nameFolder, seoTitle, seoDescription,
    bodyTitle, bodyDate, bodyText, bodyAuthor,
    imageNames, imageTexts,
  } = options;

  const title = JSON.parse(seoTitle);
  const description = JSON.parse(seoDescription);
  const displayTitle = JSON.parse(bodyTitle);
  const displayDate = JSON.parse(bodyDate);
  const dateParts = displayDate.split('.');
  const dateISO = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  const author = JSON.parse(bodyAuthor);
  const text = JSON.parse(bodyText)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(div|p|span)[^>]*>/gi, '\n')
    .replace(/<a\s+href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const names = Array.isArray(imageNames) ? imageNames : imageNames ? [imageNames] : [];
  const texts = Array.isArray(imageTexts) ? imageTexts : imageTexts ? [imageTexts] : [];

  const imagesYaml = names.map((filename, i) => {
    const rawCaption = texts[i] || '';
    const caption = rawCaption
      .replace(/\r\n/g, '<br>')
      .replace(/\n/g, '<br>')
      .trim();

    if (caption) {
      return `  - filename: ${escapeYamlString(filename)}\n    caption: ${escapeYamlString(caption)}`;
    }
    return `  - filename: ${escapeYamlString(filename)}`;
  }).join('\n');

  let yaml = '---\n';
  yaml += `title: ${escapeYamlString(title)}\n`;
  if (displayTitle && displayTitle !== title) {
    yaml += `displayTitle: ${escapeYamlString(displayTitle)}\n`;
  }
  if (description) {
    yaml += `description: ${escapeYamlString(description)}\n`;
  }
  yaml += `date: ${dateISO}\n`;
  yaml += `dateDisplay: ${escapeYamlString(displayDate)}\n`;
  yaml += `publishedDate: ${dateISO}\n`;
  yaml += `modifiedDate: ${dateModified}\n`;
  yaml += `author: ${author}\n`;
  yaml += `thumbnail: ${nameFolder}/576/${names[0] || ''}\n`;
  yaml += `thumbnailAlt: ${escapeYamlString(title)}\n`;
  yaml += `folder: ${nameFolder}\n`;
  yaml += names.length ? `images:\n${imagesYaml}\n` : `images: []\n`;
  yaml += '---\n\n';

  const markdown = yaml + text + '\n';

  const outputDir = path.join(root, 'src/content/articles');
  const mdPath = path.join(outputDir, `${nameFolder}.md`);
  writeFileSync(mdPath, markdown, 'utf-8');

  console.log(`MD saved: ${nameFolder}.md`);
}
