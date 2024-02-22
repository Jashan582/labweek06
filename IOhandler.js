const { pipeline } = require("stream/promises");
const yauzl = require("yauzl-promise");
const fs = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");
const { toGrayscale, toSepia } = require("./filter");

async function extractZip(inputPath, outputPath) {
  const zip = await yauzl.open(inputPath);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith('/')) {
        await fs.promises.mkdir(`${outputPath}/${entry.filename}`);
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(`${outputPath}/${entry.filename}`);
        await pipeline(readStream, writeStream);
      }
    }
  } finally {
    await zip.close();
  }
}

const readDirectory = async (directoryPath) => {
  let targetFiles = [];
  const files = await fs.promises.readdir(directoryPath);
  for (const file of files) {
    const fullPath = path.join(directoryPath, file);
    const stats = await fs.promises.stat(fullPath);
    if (stats.isDirectory()) {
      const subFiles = await readDirectory(fullPath); 
      targetFiles = [...targetFiles, ...subFiles];
    } else if (path.extname(file).toLowerCase() === ".png") {
      targetFiles.push(fullPath);
    }
  }
  return targetFiles;
};



const applyFilter = async (inputPath, outputPath, filterType) => {
  fs.createReadStream(path.join(__dirname, "unzipper", inputPath))
    .pipe(new PNG({ filterType: 4, colorType: 6 }))
    .on("parsed", function () {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = (this.width * y + x) << 2;
          switch (filterType) {
            case "grayscale":
              const grayValue = toGrayscale(this.data[idx], this.data[idx + 1], this.data[idx + 2]);
              this.data[idx] = this.data[idx + 1] = this.data[idx + 2] = grayValue;
              break;
            case "sepia":
              const sepiaValues = toSepia(this.data[idx], this.data[idx + 1], this.data[idx + 2]);
              this.data[idx] = sepiaValues[0];
              this.data[idx + 1] = sepiaValues[1];
              this.data[idx + 2] = sepiaValues[2];
              break;
            default:
              break;
          }
        }
      }
      this.pack().pipe(fs.createWriteStream(`${outputPath}/${inputPath}`));
    });
};

module.exports = {
  extractZip,
  readDirectory,
  applyFilter,
};
