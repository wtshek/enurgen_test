const { Router } = require("express");
const {
  extractRectCoord,
} = require("../controller/extractRectCoord.controller");

const router = Router();

router.post("/", extractRectCoord);

module.exports = router;
