const express = require("express");

const {
  getProducts,
  getProductById,
  getMegaSaleProducts,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/mega-sale", getMegaSaleProducts);
router.get("/:id", getProductById);

module.exports = router;