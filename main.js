//main.js
const path = require("path");
const IOHandler = require("./IOhandler");
const { pipeline } = require("stream");
const zipFilePath = path.join(__dirname, "myfile.zip");
const unzippedPath = path.join(__dirname, "unzipper");
const grayscaledPath = path.join(__dirname, "grayscaled");
const process = require("process");
const { Worker } = require("worker_threads");

const filter = process.argv[2];
IOHandler.readDirectory(path.dirname(zipFilePath), unzippedPath);


IOHandler.readDirectory(unzippedPath)
  .then(files => {
    files.forEach(file => {
      IOHandler.applyGrayScale(file, grayscaledPath, filter);
    });
  });
