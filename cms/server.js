import { existsSync, statSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import compression from 'compression';
import { getAllFiles, getAllDirectory, getAllJson, readJson } from './helpers/images.js';
import { saveTemplate } from './helpers/template.js';
import { saveMarkdown } from './helpers/markdown.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const port = 3000;
const author = 'Grzegorz Tomicki';

const app = express();
app.use(compression());
app.use(express.urlencoded({ extended: false, parameterLimit: 10000 }));
app.use(express.json());

app.use('/vendor', express.static(path.join(__dirname, 'public')));
app.use('/update', express.static(path.join(root, 'sources/data')));

app.get('/images/:folder/:file', (req, res) => {
  const { folder, file } = req.params;
  const imgBase = path.join(root, 'public/images', folder);
  for (const size of ['1200', '992', '768', '576']) {
    const filePath = path.join(imgBase, size, file);
    if (existsSync(filePath)) {
      res.sendFile(filePath);
      return;
    }
  }
  const directPath = path.join(imgBase, file);
  if (existsSync(directPath)) {
    res.sendFile(directPath);
    return;
  }
  res.status(404).send('Image not found');
});

app.post('/', (req, res) => {
  const {
    folderName, seoTitle, seoDescription,
    bodyTitle, bodyDate, bodyText, bodyAuthor,
    imageName, imageAlt, imageText,
  } = req.body;

  const config = {
    nameFolder: folderName,
    seoTitle: JSON.stringify(seoTitle),
    seoDescription: JSON.stringify(seoDescription),
    bodyTitle: JSON.stringify(bodyTitle),
    bodyDate: JSON.stringify(bodyDate),
    bodyText: JSON.stringify(bodyText),
    bodyAuthor: JSON.stringify(bodyAuthor),
    imageNames: imageName,
    imageAlts: imageAlt,
    imageTexts: imageText,
  };

  saveTemplate(config, root);
  saveMarkdown(config, root);

  res.redirect('./success');
});

const imagesDir = path.join(root, 'public/images');
const dataDir = path.join(root, 'sources/data');

app.get('/', (req, res) => {
  const keys = getAllDirectory(imagesDir);
  const jsonFiles = getAllJson(dataDir);

  const folders = keys.map(key => [key, jsonFiles.includes(key)]);
  const jsonOnly = jsonFiles.filter(j => !keys.includes(j)).map(j => [j, true]);

  res.send(renderIndex([...folders, ...jsonOnly]));
});

app.get('/name/:imageFolder', (req, res) => {
  const { imageFolder } = req.params;
  const folderPath = path.join(imagesDir, imageFolder);

  if (!existsSync(folderPath)) {
    res.status(404).send(render404());
    return;
  }

  const allImages = getAllFiles(folderPath, imageFolder);
  res.send(renderEditor({
    siteType: 'new',
    title: imageFolder,
    count: allImages.length,
    images: allImages,
    author,
  }));
});

app.get('/update/:imageFolder', (req, res) => {
  const { imageFolder } = req.params;
  const jsonPath = path.join(dataDir, `${imageFolder}.json`);

  if (!existsSync(jsonPath)) {
    res.status(404).send(render404());
    return;
  }

  const jsonData = readJson(jsonPath);
  const folderPath = path.join(imagesDir, imageFolder);

  // Use image order from JSON when updating
  let allImages;
  if (jsonData.body?.items?.length) {
    allImages = jsonData.body.items.map(item => {
      const img = item.img.includes('/') ? item.img.split('/').pop() : item.img;
      return `./images/${imageFolder}/${img}`;
    });
  } else {
    allImages = existsSync(folderPath) ? getAllFiles(folderPath, imageFolder) : [];
  }

  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const dateCreate = new Date(statSync(jsonPath).mtime).toLocaleString('pl', optionsDate);

  res.send(renderEditor({
    siteType: 'update',
    title: imageFolder,
    count: allImages.length,
    images: allImages,
    author,
    data: dateCreate,
    jsonData,
  }));
});

app.get('/create', (req, res) => {
  const slug = slugify(req.query.slug || '');
  if (!slug) {
    res.redirect('/');
    return;
  }
  res.send(renderEditor({
    siteType: 'new',
    title: slug,
    count: 0,
    images: [],
    author,
  }));
});

app.get('/api/images/:folder', (req, res) => {
  const { folder } = req.params;
  const folderPath = path.join(imagesDir, folder);
  if (!existsSync(folderPath)) return res.json([]);
  const sizeDir = path.join(folderPath, '576');
  const dir = existsSync(sizeDir) ? sizeDir : folderPath;
  const files = readdirSync(dir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
  res.json(files);
});

app.delete('/delete/:slug', (req, res) => {
  const { slug } = req.params;
  const jsonPath = path.join(dataDir, `${slug}.json`);
  const mdPath = path.join(root, 'src/content/articles', `${slug}.md`);
  const indexPath = path.join(dataDir, 'index.json');

  if (existsSync(jsonPath)) unlinkSync(jsonPath);
  if (existsSync(mdPath)) unlinkSync(mdPath);

  if (existsSync(indexPath)) {
    try {
      const index = JSON.parse(readFileSync(indexPath, 'utf-8'));
      index.items = index.items.filter(i => i.href !== `${slug}.html`);
      writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
    } catch {}
  }

  console.log(`Deleted: ${slug}`);
  res.json({ ok: true });
});

app.get('/gallery', (req, res) => {
  const indexPath = path.join(dataDir, 'index.json');
  const indexData = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, 'utf-8')) : { head: {}, items: [], schema: {} };
  const jsonFiles = getAllJson(dataDir);
  res.send(renderGallery(indexData, jsonFiles));
});

app.post('/gallery', (req, res) => {
  const { items } = req.body;
  const indexPath = path.join(dataDir, 'index.json');
  let indexData = { head: { title: 'Zdjęcia zebrane', description: 'Blog fotograficzny, ciekawe nietuzinkowe zdjęcia, niezapomniane chwile.' }, items: [], schema: {} };
  if (existsSync(indexPath)) {
    try { indexData = JSON.parse(readFileSync(indexPath, 'utf-8')); } catch {}
  }
  indexData.items = items.map(item => ({
    img: item.img,
    alt: item.alt,
    href: item.href,
    text: item.text,
    date: item.date,
  }));
  indexData.schema.dateModified = new Date().toISOString().slice(0, 10);
  writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf-8');
  res.json({ ok: true });
});

app.get('/success', (req, res) => {
  res.send(renderSuccess());
});

app.use((req, res) => {
  res.status(404).send(render404());
});

function renderLayout(title, siteType, content) {
  const isEditor = siteType === 'new' || siteType === 'update';
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/vendor/css/style.css">
  ${isEditor ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">' : ''}
  ${isEditor ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pell/dist/pell.min.css">' : ''}
  <title>${title}</title>
</head>
<body>
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <symbol id="camera-icon" viewBox="0 0 28 28"><path d="M14.5 13c0-.281-.219-.5-.5-.5a2.507 2.507 0 00-2.5 2.5c0 .281.219.5.5.5s.5-.219.5-.5a1.5 1.5 0 011.5-1.5c.281 0 .5-.219.5-.5zm3.5 2.031c0 2.203-1.797 4-4 4s-4-1.797-4-4 1.797-4 4-4 4 1.797 4 4zM2 24h24v-2H2v2zm18-8.969c0-3.313-2.688-6-6-6s-6 2.688-6 6 2.688 6 6 6 6-2.688 6-6zM4 5h6V3H4v2zM2 8h24V4H13.062l-1 2H1.999v2zm26-4v20c0 1.109-.891 2-2 2H2c-1.109 0-2-.891-2-2V4c0-1.109.891-2 2-2h24c1.109 0 2 .891 2 2z"/></symbol>
    <symbol id="home-icon" viewBox="0 0 32 32"><path d="M32 18.451L16 6.031 0 18.451v-5.064L16 .967l16 12.42zM28 18v12h-8v-8h-8v8H4V18l12-9z"/></symbol>
    <symbol id="info-icon" viewBox="0 0 10 28"><path d="M10 21v2c0 .547-.453 1-1 1H1c-.547 0-1-.453-1-1v-2c0-.547.453-1 1-1h1v-6H1c-.547 0-1-.453-1-1v-2c0-.547.453-1 1-1h6c.547 0 1 .453 1 1v9h1c.547 0 1 .453 1 1zM8 3v3c0 .547-.453 1-1 1H3c-.547 0-1-.453-1-1V3c0-.547.453-1 1-1h4c.547 0 1 .453 1 1z"/></symbol>
    <symbol id="chevron-up-icon" viewBox="0 0 28 28"><path d="M26.297 20.797l-2.594 2.578a.99.99 0 01-1.406 0L14 15.078l-8.297 8.297a.99.99 0 01-1.406 0l-2.594-2.578a1.009 1.009 0 010-1.422L13.297 7.797a.99.99 0 011.406 0l11.594 11.578a1.009 1.009 0 010 1.422z"/></symbol>
    <symbol id="long-arrow-right-icon" viewBox="0 0 27 28"><path d="M27 13.953a.549.549 0 01-.156.375l-6 5.531A.5.5 0 0120 19.5V16H.5a.494.494 0 01-.5-.5v-3c0-.281.219-.5.5-.5H20V8.5c0-.203.109-.375.297-.453s.391-.047.547.078l6 5.469a.508.508 0 01.156.359z"/></symbol>
  </svg>
  ${content}
  ${isEditor ? `
  <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
  <script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pl.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/pell"></script>
  <script src="https://cdn.jsdelivr.net/npm/@nicorevin/zooom@1.2.0/dist/zooom.min.js"></script>
  <script>
    const fileJson = '${title}.json';
    const type = '${siteType}';
  </script>
  <script src="/vendor/js/script.js"></script>` : ''}
</body>
</html>`;
}

function renderIndex(folders) {
  const rows = folders.map(([name, hasJson]) => `
    <tr>
      <td>
        <div class="flex align-center">
          <svg class="icon small mr-10"><use xlink:href="#camera-icon"></use></svg>
          ${name}
        </div>
      </td>
      <td class="text-center">
        <a href="/name/${name}" class="button bg-blue">NEW</a>
      </td>
      <td class="text-center">
        ${hasJson ? `<a href="/update/${name}" class="button bg-orange">UPDATE</a>` : ''}
      </td>
      <td class="text-center">
        ${hasJson ? `<button class="button bg-red" onclick="if(confirm('Usunąć ${name}? (JSON + MD, zdjęcia pozostaną)'))fetch('/delete/${name}',{method:'DELETE'}).then(r=>{if(r.ok)location.reload()})">USUŃ</button>` : ''}
      </td>
    </tr>`).join('');

  return renderLayout('CMS - Lista galerii', 'home', `
    <div class="container">
      <div class="flex gap-10 mtb-20">
        <a href="/gallery" class="button bg-red" style="padding:12px 20px;font-size:100%">EDYTUJ GALERIĘ (index.json)</a>
      </div>
      <div class="info green box-shadow mtb-20">
        <h4 class="uppercase mb-5">Nowy artykuł</h4>
        <form action="/create" method="GET" class="flex gap-10 align-center">
          <input type="text" name="slug" placeholder="nazwa-artykulu (slug)" required style="max-width:400px">
          <button class="button bg-green" type="submit">UTWÓRZ</button>
        </form>
      </div>
      <table>
        <thead>
          <tr>
            <th class="text-left">Lista galerii</th>
            <th class="text-center">Nowy</th>
            <th class="text-center">Edycja</th>
            <th class="text-center">Usuń</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="info blue flex align-center box-shadow">
        <svg class="icon small mr-10"><use xlink:href="#info-icon"></use></svg>
        Tworzenie nowych lub edycja istniejących artykułów.
      </div>
    </div>`);
}

function renderEditor({ siteType, title, count, images, author, data, jsonData }) {
  const buttonText = siteType === 'new' ? 'ZAPISZ' : 'AKTUALIZUJ';
  const dateInfo = data ? `<div class="date-time"><small>Ostatnia zmiana - ${data}</small></div>` : '';

  const imageItems = images.map((image, i) => {
    const filename = image.split('/').pop();
    const jsonItem = jsonData?.body?.items?.[i];
    const altVal = jsonItem?.alt || '';
    const textVal = jsonItem?.text ? jsonItem.text.replace(/<br\s*\/?>/g, '\r\n') : '';
    return `
    <div class="flex gap-20 item">
      <div class="image-section">
        <span class="ribbon label">${filename}</span>
        <img class="img-zoom" src="/images/${title}/${filename}" width="1200" height="800">
        <input type="hidden" name="imageName" value="${filename}">
      </div>
      <div class="edit-section">
        <div class="form-column">
          <label>alt do zdjęcia</label>
          <input type="text" name="imageAlt" placeholder="alt do zdjęcia" value="${escapeHtml(altVal)}">
        </div>
        <div class="form-column">
          <label>treść pod zdjęciem</label>
          <textarea name="imageText" rows="4">${escapeHtml(textVal)}</textarea>
        </div>
      </div>
    </div>`;
  }).join('');

  const seoTitle = jsonData?.head?.title || '';
  const seoDesc = jsonData?.head?.description || '';
  const bodyTitle = jsonData?.body?.title || '';
  const bodyDate = jsonData?.body?.date || '';
  const bodyText = jsonData?.body?.text || '';
  const bodyAuthor = jsonData?.schema?.author || author;

  return renderLayout(title, siteType, `
    <div class="container page">
      <h1>
        <a href="/" class="text-d-none uppercase">
          <div class="flex align-center">
            <svg class="icon big mr-10 fill-red"><use xlink:href="#home-icon"></use></svg>
            ${title}
          </div>
        </a>
      </h1>
      ${dateInfo}
      <form action="/" method="POST">
        <input type="hidden" name="folderName" value="${title}">
        <div class="form box-shadow">
          <h4 class="dividing uppercase mb-5 pb-5">seo</h4>
          <div class="flex gap-10">
            <div class="form-column">
              <label for="seoTitle">title head</label>
              <input id="seoTitle" type="text" name="seoTitle" placeholder="title" value="${escapeHtml(seoTitle)}" required>
            </div>
            <div class="form-column">
              <label for="seoDescription">description head</label>
              <input id="seoDescription" type="text" name="seoDescription" placeholder="description" value="${escapeHtml(seoDesc)}" required>
            </div>
          </div>
          <h4 class="dividing uppercase mt-20 mb-5 ptb-5">dane na górze strony</h4>
          <div class="flex gap-10">
            <div class="form-column">
              <label for="bodyTitle">tytuł H1</label>
              <input id="bodyTitle" type="text" name="bodyTitle" placeholder="title" value="${escapeHtml(bodyTitle)}" required>
            </div>
            <div class="form-column">
              <label for="bodyDate">data</label>
              <input id="bodyDate" type="text" class="bodyDate" name="bodyDate" placeholder="Data" value="${escapeHtml(bodyDate)}" required>
            </div>
          </div>
          <div class="form-column">
            <label>tekst</label>
            <div id="editor" class="pell"></div>
            <textarea id="text-output" name="bodyText" hidden>${escapeHtml(bodyText)}</textarea>
          </div>
          <div class="half">
            <label for="bodyAuthor">autor</label>
            <input id="bodyAuthor" type="text" name="bodyAuthor" placeholder="Autor artykułu" value="${escapeHtml(bodyAuthor)}" required>
          </div>
        </div>
        <h2 class="flex align-center mtb-20 dividing uppercase">lista zdjęć
          <svg class="icon big fill-red mrl-10"><use xlink:href="#long-arrow-right-icon"></use></svg>
          szt. ${count}
        </h2>
        <div id="columns" class="columns">
          ${imageItems}
        </div>
        <div class="footer flex justify-center">
          <div class="container gap-20 mtb-10 flex">
            <button class="button bg-orange">${buttonText}</button>
            <div class="flex checkbox align-center grid-view-checked">
              <input id="gridGen" class="styled-checkbox" type="checkbox" name="grid">
              <label for="gridGen" class="flex align-center">grid</label>
            </div>
            <button class="flex button align-center bg-gray gap-10 scroll" type="button" name="scroll">
              <svg class="icon smaller fill-white"><use xlink:href="#chevron-up-icon"></use></svg>
              <div>TOP</div>
            </button>
          </div>
        </div>
      </form>
    </div>`);
}

function renderGallery(indexData, jsonFiles) {
  const items = indexData.items || [];
  const existingSlugs = items.map(i => i.href.replace('.html', ''));
  const availableArticles = jsonFiles.filter(s => !existingSlugs.includes(s));

  const itemRows = items.map((item, i) => {
    const slug = item.href.replace('.html', '');
    const imgFile = item.img.split('/').pop();
    return `
    <div class="gallery-item flex gap-10 align-center" data-index="${i}">
      <span class="gallery-handle" style="cursor:grab;font-size:20px;padding:0 8px">☰</span>
      <img src="/images/${slug}/${imgFile}" style="width:80px;height:60px;object-fit:cover;border-radius:4px;flex-shrink:0">
      <div style="flex:1;display:flex;flex-wrap:wrap;gap:5px;align-items:center">
        <input type="text" class="g-text" value="${escapeHtml(item.text)}" placeholder="tekst" style="width:200px">
        <input type="text" class="g-alt" value="${escapeHtml(item.alt)}" placeholder="alt" style="width:200px">
        <input type="text" class="g-date" value="${escapeHtml(item.date)}" placeholder="data" style="width:130px">
        <select class="g-img" style="width:180px;padding:6px;border-radius:4px;border:1px solid #ccc"></select>
      </div>
      <input type="hidden" class="g-href" value="${escapeHtml(item.href)}">
      <input type="hidden" class="g-folder" value="${escapeHtml(slug)}">
      <input type="hidden" class="g-current-img" value="${escapeHtml(item.img)}">
      <button type="button" class="button bg-red gallery-remove" style="flex-shrink:0">✕</button>
    </div>`;
  }).join('');

  const optionsHtml = availableArticles.map(s => `<option value="${s}">${s}</option>`).join('');

  return renderLayout('Edycja galerii', 'gallery', `
    <div class="container page">
      <h1>
        <a href="/" class="text-d-none uppercase">
          <div class="flex align-center">
            <svg class="icon big mr-10 fill-red"><use xlink:href="#home-icon"></use></svg>
            Edycja galerii (index.json)
          </div>
        </a>
      </h1>
      <div class="form box-shadow mt-10">
        <h4 class="dividing uppercase mb-5 pb-5">Dodaj artykuł do galerii</h4>
        <div class="flex gap-10 align-center">
          <select id="addArticle" style="padding:8px;border-radius:4px;border:1px solid #ccc;width:300px">
            <option value="">-- wybierz artykuł --</option>
            ${optionsHtml}
          </select>
          <button type="button" id="addBtn" class="button bg-green">DODAJ</button>
        </div>
      </div>
      <h2 class="mtb-20 uppercase">Kolejność artykułów (${items.length})</h2>
      <div class="gallery-header flex gap-10 align-center" style="padding:8px 10px;font-size:75%;text-transform:uppercase;font-weight:bold;color:#666;border-bottom:2px solid #ccc;margin-bottom:8px">
        <span style="width:28px"></span>
        <span style="width:80px">foto</span>
        <span style="width:200px">tytuł (pod zdjęciem)</span>
        <span style="width:200px">alt (atrybut img)</span>
        <span style="width:130px">data</span>
        <span style="width:180px">miniatura</span>
        <span style="width:32px"></span>
      </div>
      <div id="galleryList" style="margin-bottom:80px">
        ${itemRows}
      </div>
      <div class="footer flex justify-center">
        <div class="container gap-20 mtb-10 flex">
          <button type="button" id="saveGallery" class="button bg-orange" style="padding:12px 20px">ZAPISZ</button>
          <button type="button" class="flex button align-center bg-gray gap-10 scroll" name="scroll">
            <svg class="icon smaller fill-white"><use xlink:href="#chevron-up-icon"></use></svg>
            <div>TOP</div>
          </button>
        </div>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <script>
    (function() {
      const list = document.getElementById('galleryList');

      new Sortable(list, { handle: '.gallery-handle', animation: 150 });

      // Load thumbnail options for each item
      list.querySelectorAll('.gallery-item').forEach(loadImages);

      async function loadImages(item) {
        const folder = item.querySelector('.g-folder').value;
        const currentImg = item.querySelector('.g-current-img').value;
        const select = item.querySelector('.g-img');
        try {
          const res = await fetch('/api/images/' + folder);
          const files = await res.json();
          select.innerHTML = files.map(f => {
            const val = './images/' + folder + '/576/' + f;
            const sel = val === currentImg ? ' selected' : '';
            return '<option value="' + val + '"' + sel + '>' + f + '</option>';
          }).join('');
        } catch(e) { console.error(e); }
      }

      // Remove item
      list.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-remove')) {
          e.target.closest('.gallery-item').remove();
        }
      });

      // Add article
      document.getElementById('addBtn').addEventListener('click', async () => {
        const sel = document.getElementById('addArticle');
        const slug = sel.value;
        if (!slug) return;

        const res = await fetch('/api/images/' + slug);
        const files = await res.json();
        const firstImg = files[0] || '';
        const imgPath = './images/' + slug + '/576/' + firstImg;

        const div = document.createElement('div');
        div.className = 'gallery-item flex gap-10 align-center';
        div.innerHTML = \`
          <span class="gallery-handle" style="cursor:grab;font-size:20px;padding:0 8px">☰</span>
          <img src="/images/\${slug}/\${firstImg}" style="width:80px;height:60px;object-fit:cover;border-radius:4px;flex-shrink:0">
          <div style="flex:1;display:flex;flex-wrap:wrap;gap:5px;align-items:center">
            <input type="text" class="g-text" value="\${slug}" placeholder="tekst" style="width:200px">
            <input type="text" class="g-alt" value="" placeholder="alt" style="width:200px">
            <input type="text" class="g-date" value="" placeholder="data" style="width:130px">
            <select class="g-img" style="width:180px;padding:6px;border-radius:4px;border:1px solid #ccc">
              \${files.map(f => '<option value="./images/' + slug + '/576/' + f + '">' + f + '</option>').join('')}
            </select>
          </div>
          <input type="hidden" class="g-href" value="\${slug}.html">
          <input type="hidden" class="g-folder" value="\${slug}">
          <input type="hidden" class="g-current-img" value="\${imgPath}">
          <button type="button" class="button bg-red gallery-remove" style="flex-shrink:0">✕</button>
        \`;
        list.appendChild(div);

        // Update thumbnail preview on select change
        div.querySelector('.g-img').addEventListener('change', function() {
          const f = this.value.split('/').pop();
          div.querySelector('img').src = '/images/' + slug + '/' + f;
        });

        // Remove from dropdown
        sel.querySelector('option[value="' + slug + '"]').remove();
        sel.value = '';
      });

      // Update preview on select change for existing items
      list.addEventListener('change', (e) => {
        if (e.target.classList.contains('g-img')) {
          const item = e.target.closest('.gallery-item');
          const folder = item.querySelector('.g-folder').value;
          const f = e.target.value.split('/').pop();
          item.querySelector('img').src = '/images/' + folder + '/' + f;
        }
      });

      // Save
      document.getElementById('saveGallery').addEventListener('click', async () => {
        const items = [...list.querySelectorAll('.gallery-item')].map(item => ({
          img: item.querySelector('.g-img').value,
          alt: item.querySelector('.g-alt').value,
          href: item.querySelector('.g-href').value,
          text: item.querySelector('.g-text').value,
          date: item.querySelector('.g-date').value,
        }));
        const res = await fetch('/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });
        if (res.ok) {
          window.location.href = '/success';
        } else {
          alert('Błąd zapisu');
        }
      });

      // Scroll to top
      document.querySelector('.scroll')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scroll({ top: 0, behavior: 'smooth' });
      });
    })();
    </script>`);
}

function renderSuccess() {
  return renderLayout('Sukces', 'success', `
    <div class="container">
      <div class="info green box-shadow">
        <div class="flex content-info">
          <svg class="icon big mt-5 mr-10"><use xlink:href="#info-icon"></use></svg>
          <div>
            <p>JSON i MD zostały zapisane</p>
            <a href="/" class="d-ib button bg-green mt-10 gap-10">STRONA GŁÓWNA</a>
          </div>
        </div>
      </div>
    </div>`);
}

function render404() {
  return renderLayout('Błąd 404', '404', `
    <div class="container">
      <div class="info red box-shadow">
        <div class="flex content-info">
          <svg class="icon big mt-5 mr-10"><use xlink:href="#info-icon"></use></svg>
          <div>
            <p>Nie znaleziono strony. Adres powinien zawierać nazwę folderu ze zdjęciami.</p>
            <a href="/" class="d-ib button bg-green mt-10 gap-10">STRONA GŁÓWNA</a>
          </div>
        </div>
      </div>
    </div>`);
}

function slugify(str) {
  const map = { 'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z',
    'Ą':'a','Ć':'c','Ę':'e','Ł':'l','Ń':'n','Ó':'o','Ś':'s','Ź':'z','Ż':'z' };
  return str
    .split('').map(c => map[c] || c).join('')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

app.listen(port, () => {
  console.log(`CMS: http://localhost:${port}`);
});
