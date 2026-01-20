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
        ├── 1200
        ├── 768
        ├── 576
        └── 992
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

### Optymalizacja zdjęć

Zdjęcia ładowane dynamicznie, serwowane w różnych rozmiarach zależnie od szerokości okna.

Generator rozmiarów: [sharp-images](https://github.com/tomik23/sharp-images)

### Wersja produkcyjna

[https://www.grzegorztomicki.pl](https://www.grzegorztomicki.pl)
