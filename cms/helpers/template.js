import { writeFileSync } from 'fs';
import path from 'path';
import { readJson, today, toArray } from './images.js';

export function saveTemplate(options, root) {
  const {
    nameFolder, seoTitle, seoDescription,
    bodyTitle, bodyDate, bodyText, bodyAuthor,
    imageNames, imageAlts, imageTexts,
  } = options;

  const names = toArray(imageNames);
  const alts = toArray(imageAlts);
  const texts = toArray(imageTexts);

  const items = names.map((img, i) => ({
    path: `./images/${nameFolder}/`,
    img,
    alt: alts[i] || '',
    text: texts[i]?.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>') || '',
  }));

  const todayStr = today();
  const json = {
    head: { title: seoTitle, description: seoDescription },
    body: { title: bodyTitle, date: bodyDate, text: bodyText, items },
    schema: {
      datePublished: todayStr,
      dateModified: todayStr,
      author: bodyAuthor,
    },
  };

  const dataDir = path.join(root, 'sources/data');
  const jsonPath = path.join(dataDir, `${nameFolder}.json`);

  // preserve original datePublished if updating
  try {
    const existing = readJson(jsonPath);
    if (existing.schema?.datePublished) {
      json.schema.datePublished = existing.schema.datePublished;
    }
  } catch {}

  writeFileSync(jsonPath, JSON.stringify(json, null, 2), 'utf-8');

  // update index.json
  updateIndex(root, nameFolder, json);

  console.log(`JSON saved: ${nameFolder}.json`);
}

function updateIndex(root, nameFolder, json) {
  const indexPath = path.join(root, 'sources/data/index.json');
  let index = { head: { title: 'Zdjęcia zebrane', description: '' }, items: [], schema: {} };

  try {
    index = readJson(indexPath);
  } catch (e) {
    console.error('Failed to read index.json:', e);
  }

  const firstImage = json.body.items?.[0]?.img || '';
  const entry = {
    img: `./images/${nameFolder}/576/${firstImage}`,
    alt: json.head.title,
    href: `${nameFolder}.html`,
    text: json.body.title,
    date: json.body.date,
  };

  const existingIdx = index.items.findIndex(i => i.href === entry.href);
  if (existingIdx >= 0) {
    index.items[existingIdx] = entry;
  } else {
    index.items.unshift(entry);
  }

  writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
}
