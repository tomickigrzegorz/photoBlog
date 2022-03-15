const fs = require("fs");
const parse = require("node-html-parser").parse;

const dir = "dist";
const countFile = fs.readdirSync(dir);
const files = countFile.filter(function (elm) {
  return elm.match(/.*\.(html?)/gi);
});

let fileExits = true;
let readHeadFile;
try {
  readHeadFile = fs.readFileSync(
    `${dir}/assets/head.txt`,
    "utf8",
    (err, data) => data
  );
} catch (err) {
  fileExits = false;
}

files.map((file) => {
  fs.readFile(`${dir}/${file}`, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    const root = parse(data);
    const head = root.querySelector("head");

    if (!fileExits) return;

    head.insertAdjacentHTML("beforeend", readHeadFile);

    const htmlData = root.toString();

    fs.writeFile(`${dir}/${file}`, htmlData, function (err, result) {
      if (err) console.log("error", err);
    });
  });
});
