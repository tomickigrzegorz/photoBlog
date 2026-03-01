## My photo blog

Built with `Astro`, content stored in `markdown` files.

```
src
├── components
│   ├── ArticleCard.astro
│   ├── Gallery.astro
│   └── ...
├── content
│   └── articles
│       └── jeden-dzien-w-berlinie.md
├── layouts
│   └── BaseLayout.astro
├── pages
│   ├── index.astro
│   └── [slug].astro
└── styles
public
└── images
    └── jeden-dzien-w-berlinie
        ├── 576
        ├── 768
        ├── 992
        └── 1200
sources
└── data
    ├── index.json
    └── jeden-dzien-w-berlinie.json
cms
├── server.js
├── helpers
│   ├── template.js
│   ├── markdown.js
│   └── images.js
└── public
    ├── css/style.css
    └── js/script.js
```

### Installation

```bash
git clone
npm i
```

### Running

Dev

```bash
npm run dev
```

Build

```bash
npm run build
```

### CMS

Article management panel (Express, port 3000).

```bash
npm run cms
```

Features:
- create and edit articles
- manage images (sorting, captions, alt text)
- image preview
- auto-save to `sources/data/*.json` and generate `src/content/articles/*.md`

Source data is stored in `sources/data/` as JSON files, from which Markdown files are generated for Astro.

### JSON → Markdown conversion

Manual conversion of `sources/data/*.json` files to `src/content/articles/*.md`.

All files:

```bash
npm run convert-md
```

Single file (provide slug without `.json`):

```bash
npm run convert-md -- bratyslawa
```

### Image optimization

Images are loaded dynamically and served in multiple sizes (576, 768, 992, 1200) depending on the viewport width.

Size generator: [sharp-images](https://github.com/tomickigrzegorz/sharp-images)

### Live site

[https://www.grzegorztomicki.pl](https://www.grzegorztomicki.pl)
