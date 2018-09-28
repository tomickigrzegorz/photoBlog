const fs = require("fs");

const htmlPlace = "build";
const ulrPart = [];

fs.readdir(`${htmlPlace}`, function (err, files) {
    if (err)
        throw err;
    for (let index in files) {
        let rest = files[index].split('.')[1];
        if (rest === 'html') {
            let path = `
                <url>
                    <loc>http://blog.grzegorztomicki.pl/${files[index]}</loc>
                    <changefreq>monthly</changefreq>
                </url>
            `;
            ulrPart.push(path);
        }

    }

    const template = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
            ${ulrPart.join('')}</urlset>`;

    fs.writeFile(`./sitemap.xml`, template, function (err) {});
});