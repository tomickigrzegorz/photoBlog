const { readdir, writeFile } = require('fs');

const htmlPlace = './dist';
const ulrPart = [];

readdir(`${htmlPlace}`, function (err, files) {
  if (err) throw err;

  files.forEach(file => {
    const rest = file.split('.')[1];
    const name = file.split('.')[0];

    const changeFreq = 'monthly';
    if (rest === 'html') {
      const path = `
  <url>
    <loc>https://grzegorztomicki.pl/${file}</loc>
    <changefreq>${changeFreq}</changefreq>
  </url>
      `;
      ulrPart.push(path);
    }
  });

  const template = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${ulrPart.join(
    ''
  )}
</urlset>`;

  writeFile('./dist/sitemap.xml', template, (err) => { });
});
