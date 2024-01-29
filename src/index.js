const express = require("express");
const multer = require("multer");
const extractRectCoordRoute = require("./routes/extractRectCoord.routes");

// NOTE: nodejs doesn't openCV imread require HTMLImageElement | HTMLCanvasElement,
// so need to set up a dom and canvas to interact with the elements
const { JSDOM } = require("jsdom");
const { Canvas, Image, ImageData, loadImage } = require("canvas");

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    const filetypes = /png/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return callback(null, true);
    }

    callback("Only PNG files are allowed");
  },
});

app.use("/extract-rect-coords", upload.single("image"), extractRectCoordRoute);

function loadOpenCV() {
  return new Promise((resolve) => {
    global.Module = {
      onRuntimeInitialized: resolve,
    };
    global.cv = require("opencv.js");
  });
}

// Using jsdom and node-canvas we define some global variables to emulate HTML DOM.
// only define those globals used by cv.imread()
function installDOM() {
  const dom = new JSDOM();
  global.document = dom.window.document;
  global.Image = Image;
  global.HTMLCanvasElement = Canvas;
  global.ImageData = ImageData;
  global.HTMLImageElement = Image;
}

app.listen(PORT, async () => {
  installDOM();
  await loadOpenCV();
  console.log(`Server is running on http://localhost:${PORT}`);
});
