## My photo blog

Oparty na `Astro`, dane w plikach `markdown`.

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

### Instalacja

```bash
git clone
npm i
```

### Uruchomienie

Dev

```bash
npm run dev
```

Build

```bash
npm run build
```

### CMS

Panel do zarządzania artykułami (Express, port 3000).

```bash
npm run cms
```

Funkcje:
- tworzenie i edycja artykułów
- zarządzanie zdjęciami (sortowanie, podpisy, teksty alternatywne)
- podgląd zdjęć
- automatyczny zapis do `sources/data/*.json` i generowanie `src/content/articles/*.md`

Dane źródłowe przechowywane w `sources/data/` (pliki JSON), z których generowane są pliki markdown dla Astro.

### Optymalizacja zdjęć

Zdjęcia ładowane dynamicznie, serwowane w różnych rozmiarach (576, 768, 992, 1200) zależnie od szerokości okna.

Generator rozmiarów: [sharp-images](https://github.com/tomickigrzegorz/sharp-images)

### Wersja produkcyjna

[https://www.grzegorztomicki.pl](https://www.grzegorztomicki.pl)
