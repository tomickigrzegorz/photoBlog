import { writeFileSync } from 'fs';
import path from 'path';
import { today, toArray } from './images.js';

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

  const dateParts = bodyDate.split('.');
  const dateISO = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  const text = bodyText
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(div|p|span)[^>]*>/gi, '\n')
    .replace(/<a\s+href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const names = toArray(imageNames);
  const texts = toArray(imageTexts);

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

  const dateModified = today();

  let yaml = '---\n';
  yaml += `title: ${escapeYamlString(seoTitle)}\n`;
  if (bodyTitle && bodyTitle !== seoTitle) {
    yaml += `displayTitle: ${escapeYamlString(bodyTitle)}\n`;
  }
  if (seoDescription) {
    yaml += `description: ${escapeYamlString(seoDescription)}\n`;
  }
  yaml += `date: ${dateISO}\n`;
  yaml += `dateDisplay: ${escapeYamlString(bodyDate)}\n`;
  yaml += `publishedDate: ${dateISO}\n`;
  yaml += `modifiedDate: ${dateModified}\n`;
  yaml += `author: ${bodyAuthor}\n`;
  yaml += `thumbnail: ${nameFolder}/576/${names[0] || ''}\n`;
  yaml += `thumbnailAlt: ${escapeYamlString(seoTitle)}\n`;
  yaml += `folder: ${nameFolder}\n`;
  yaml += names.length ? `images:\n${imagesYaml}\n` : `images: []\n`;
  yaml += '---\n\n';

  const markdown = yaml + text + '\n';

  const outputDir = path.join(root, 'src/content/articles');
  const mdPath = path.join(outputDir, `${nameFolder}.md`);
  writeFileSync(mdPath, markdown, 'utf-8');

  console.log(`MD saved: ${nameFolder}.md`);
}
