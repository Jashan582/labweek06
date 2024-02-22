//filter.js
const fs = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");

const grayscalePixel = (red, green, blue) => {
    return (0.21 * red + 0.72 * green + 0.07 * blue);
};

const sepiaFilter = (red, green, blue) => {
    const newRed = parseInt((0.393 * red + 0.769 * green + 0.189 * blue));
    const newGreen = parseInt((0.349 * red + 0.686 * green + 0.168 * blue));
    const newBlue = parseInt((0.272 * red + 0.534 * green + 0.131 * blue));
    let r, g, b;
    if (newRed > 255) {
        r = 255;
    } else {
        r = newRed;
    }
    if (newGreen > 255) {
        g = 255;
    } else {
        g = newGreen;
    }
    if (newBlue > 255) {
        b = 255;
    } else {
        b = newBlue;
    }
    return [r, g, b];
};

module.exports = { grayscalePixel, sepiaFilter };
