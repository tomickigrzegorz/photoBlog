const fs = require('fs');

const nameGallery = 'lublin';
const name = nameGallery; // = nameGallery folder i json tak samo sie nazywa

const test = [];
const author = 'Grzegorz Tomicki';

let now = new Date();
let date = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;

let datePublished = new Date().toISOString().slice(0, 10);
let dateModified = datePublished;

fs.readdir(`../sources/images/${nameGallery}/1200/`, function(err, files) {
  if (err) throw err;
  files.forEach(file => {
    let path = `{"path":"./images/${nameGallery}/","img":"${file}","alt":""}`;
    test.push(`\r\n\t\t\t\t${path}`);
  });

  const template = `{
    "head": {
        "title": "",
        "description": ""
    },
    "body": {
        "title": "",
        "date": "${date}",
        "text": "",
        "items": [${test}
         ]
    },
    "footer": {
        "js": "../../build/js/boundle.min.js"
    },
    "schema": {
        "datePublished": "${datePublished}",
        "dateModified": "${dateModified}",
        "author": "${author}"
    }
}
    `;
  fs.writeFile(`../sources/data/${name}.json`, template, function(error) {});
});
