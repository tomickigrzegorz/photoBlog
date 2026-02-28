import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';

export function saveTemplate(options, root) {
  const {
    nameFolder, seoTitle, seoDescription,
    bodyTitle, bodyDate, bodyText, bodyAuthor,
    imageNames, imageAlts, imageTexts,
  } = options;

  const title = JSON.parse(seoTitle);
  const description = JSON.parse(seoDescription);
  const bTitle = JSON.parse(bodyTitle);
  const bDate = JSON.parse(bodyDate);
  const bText = JSON.parse(bodyText);
  const bAuthor = JSON.parse(bodyAuthor);

  const names = Array.isArray(imageNames) ? imageNames : imageNames ? [imageNames] : [];
  const alts = Array.isArray(imageAlts) ? imageAlts : imageAlts ? [imageAlts] : [];
  const texts = Array.isArray(imageTexts) ? imageTexts : imageTexts ? [imageTexts] : [];

  const items = names.map((img, i) => ({
    path: `./images/${nameFolder}/`,
    img,
    alt: alts[i] || '',
    text: texts[i]?.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>') || '',
  }));

  const json = {
    head: { title, description },
    body: { title: bTitle, date: bDate, text: bText, items },
    schema: {
      datePublished: new Date().toISOString().slice(0, 10),
      dateModified: new Date().toISOString().slice(0, 10),
      author: bAuthor,
    },
  };

  const dataDir = path.join(root, 'sources/data');
  const jsonPath = path.join(dataDir, `${nameFolder}.json`);

  // preserve original datePublished if updating
  if (existsSync(jsonPath)) {
    try {
      const existing = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      if (existing.schema?.datePublished) {
        json.schema.datePublished = existing.schema.datePublished;
      }
    } catch {}
  }

  writeFileSync(jsonPath, JSON.stringify(json, null, 2), 'utf-8');

  // update index.json
  updateIndex(root, nameFolder, json);

  console.log(`JSON saved: ${nameFolder}.json`);
}

function updateIndex(root, nameFolder, json) {
  const indexPath = path.join(root, 'sources/data/index.json');
  let index = { head: { title: 'Zdjęcia zebrane', description: '' }, items: [], schema: {} };

  if (existsSync(indexPath)) {
    try {
      index = JSON.parse(readFileSync(indexPath, 'utf-8'));
    } catch {}
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
