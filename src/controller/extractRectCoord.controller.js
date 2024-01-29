const { loadImage } = require("canvas");

/**
 * Extracts the coordinates of the bounding rectangles of the contours in the given image.
 *
 * @param {Object} req - The HTTP request object containing an image file in the `file` property.
 * {
 *  file: Buffer
 * }
 * @param {Object} res - The HTTP response object.
 * @returns {Array} An array of objects with `id` and `coordinates` properties.
 *
 * @example
 * // Sample output
 * [
 *   {
 *     id: 0,
 *     coordinates: [
 *       [x1, y1],
 *       [x2, y2],
 *       [x3, y3],
 *       [x4, y4],
 *     ],
 *   },
 *   // ...
 * ]
 */

const extractRectCoord = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).send("Image required");
    }

    const image = await loadImage(req.file.buffer);

    const img = cv.imread(image);

    const gray = new cv.Mat();
    cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

    const thresh = new cv.Mat();
    cv.threshold(gray, thresh, 0, 255, cv.THRESH_BINARY_INV);

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
};

module.exports = {
  extractRectCoord,
};
