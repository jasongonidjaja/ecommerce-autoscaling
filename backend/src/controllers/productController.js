const pool = require("../config/database");

const getProducts = async (req, res) => {
  try {
    const [products] = await pool.query(
      "SELECT * FROM products ORDER BY id ASC"
    );

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error getting products:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    console.error("Error getting product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
    });
  }
};

const getMegaSaleProducts = async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT *
       FROM products
       WHERE is_mega_sale = TRUE
       ORDER BY id ASC`
    );

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error getting mega sale products:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve mega sale products",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getMegaSaleProducts,
};