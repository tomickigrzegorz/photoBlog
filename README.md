## My photo blog

Built with [Astro](https://astro.build/), content stored in Markdown files. Articles are authored via a built-in CMS (Express, port 3000) — the CMS saves data as JSON, which is then converted to Markdown for Astro.

### Project structure

```
src
├── components          # Astro components (ArticleCard, Gallery, …)
├── content
│   └── articles        # Generated .md files (do not edit manually)
├── layouts
│   └── BaseLayout.astro
├── pages
│   ├── index.astro
│   └── [slug].astro
└── styles
public
└── images
    └── {slug}
        ├── 576
        ├── 768
        ├── 992
        └── 1200
sources
└── data                # Source of truth
    ├── index.json      # Gallery listing (thumbnails, titles, dates)
    └── {slug}.json     # Per-article data
cms
├── server.js           # Express server (port 3000)
├── helpers
│   ├── template.js     # Saves JSON + updates index.json
│   ├── markdown.js     # Generates .md from JSON
│   └── images.js       # File listing utilities
└── public
    ├── css/style.css
    └── js/script.js
scripts
└── json-to-md.js       # Standalone JSON → Markdown converter
```

---

### Installation

```bash
git clone https://github.com/tomickigrzegorz/blog-gt
npm install
```

Copy the environment file and adjust if needed:

```bash
cp .env.example .env
```

`.env.example`:
```
BLOG_AUTHOR=Grzegorz Tomicki
```

---

### Development

```bash
npm run dev       # Astro dev server (hot reload)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

---

### Adding photos

Before creating an article, add the photos to the right folder:

```
public/images/{slug}/{size}/{filename}.jpg
```

Sizes: `576`, `768`, `992`, `1200`. Use [sharp-images](https://github.com/tomickigrzegorz/sharp-images) to generate all sizes automatically from originals.

---

### CMS

A local Express panel for creating and editing articles.

```bash
npm run cms
```

Open [http://localhost:3000](http://localhost:3000).

#### What the CMS does

- Lists all image folders from `public/images/` and existing JSON files from `sources/data/`
- **New article** — click a folder that has no JSON yet → opens the editor pre-filled with all images from that folder
- **Edit article** — click a folder that already has a JSON → opens the editor with saved data (images in saved order)
- **Save** → the CMS does two things automatically:
  1. Writes `sources/data/{slug}.json` (article data)
  2. Updates `sources/data/index.json` (gallery thumbnail entry)
  3. Generates `src/content/articles/{slug}.md` (Markdown for Astro)

#### Editor fields

| Field | Description |
|---|---|
| SEO title | `<title>` tag and `head.title` in JSON |
| SEO description | `<meta description>` |
| Display title | Shown on the article page, may include date range |
| Date | Trip/session date, displayed on the page (e.g. `07-17.10.2016`) |
| Intro text | Optional text above the gallery (supports basic HTML) |
| Author | Defaults to `BLOG_AUTHOR` from `.env` |
| Images | Sortable (drag & drop), each has alt text and caption |

#### Data flow

```
CMS form submit (POST /)
  └─► template.js  → sources/data/{slug}.json
  └─► template.js  → sources/data/index.json  (thumbnail entry)
  └─► markdown.js  → src/content/articles/{slug}.md
```

---

### JSON → Markdown conversion

The `scripts/json-to-md.js` script converts JSON source files to Markdown manually — useful when JSON files were edited directly or after bulk changes.

**Convert all articles:**

```bash
npm run convert-md
```

**Convert a single article** (pass the slug without `.json`):

```bash
npm run convert-md -- bratyslawa
```

Or run the script directly:

```bash
node scripts/json-to-md.js bratyslawa
```

The generated `.md` file contains YAML frontmatter with all article metadata (title, description, date, thumbnail, images array) and the intro text as Markdown body. **Do not edit `.md` files manually** — they are overwritten on every conversion.

---

### Image sizes

Images are served responsively. The CMS and the site resolve images by trying sizes in descending order: `1200 → 992 → 768 → 576`.

Size generator: [sharp-images](https://github.com/tomickigrzegorz/sharp-images)

---

### Live site

[https://www.grzegorztomicki.pl](https://www.grzegorztomicki.pl)
