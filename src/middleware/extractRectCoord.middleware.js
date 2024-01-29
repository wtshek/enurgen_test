const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  onError: function (err, next) {
    next(err);
  },
  fileFilter: (req, file, callback) => {
    const filetypes = /png/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return callback(null, true);
    }

    callback("Only PNG files are allowed", false);
  },
}).single("image");

function imageUploadMiddleware(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).send("Internal Server error");
    } else if (err) {
      return res.status(400).send(err);
    }
    next();
  });
}

module.exports = {
  imageUploadMiddleware,
};
