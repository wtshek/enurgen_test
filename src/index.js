const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

// NOTE: nodejs doesn't openCV imread require HTMLImageElement | HTMLCanvasElement,
// so need to set up a dom and canvas to interact with the elements
const { JSDOM } = require("jsdom");
const { Canvas, Image, ImageData, loadImage } = require("canvas");

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/extract-rect-coords", upload.single("image"), async (req, res) => {
  try {
    const image = await loadImage(req.file.buffer);

    // Load the image
    const img = cv.imread(image);

    // Convert the image to grayscale
    const gray = new cv.Mat();
    cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

    // Threshold the image to obtain a binary image
    const thresh = new cv.Mat();
    cv.threshold(gray, thresh, 0, 255, cv.THRESH_BINARY_INV);

    // Find contours in the binary image
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(
      thresh,
      contours,
      hierarchy,
      cv.RETR_TREE,
      cv.CHAIN_APPROX_SIMPLE
    );

    // Extract the coordinates of the bounding rectangles
    const result = [];
    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const rect = cv.boundingRect(cnt);
      const { x, y, width, height } = rect;
      const coordinates = [
        [x, y],
        [x + width, y],
        [x, y + height],
        [x + width, y + height],
      ];

      result.push({
        id: i,
        coordinates,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Load opencv.js just like before but using Promise instead of callbacks:
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
  // before loading opencv.js we emulate a minimal HTML DOM
  installDOM();
  await loadOpenCV();
  console.log(`Server is running on http://localhost:${PORT}`);
});
