const pool = require("../config/database");

const checkout = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { productId, quantity } = req.body;

    // 1. Validasi input
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity are required",
      });
    }

    // 2. Mulai transaction
    await connection.beginTransaction();

    // 3. Ambil product dan lock row
    const [products] = await connection.query(
      `SELECT *
       FROM products
       WHERE id = ?
       FOR UPDATE`,
      [productId]
    );

    if (products.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = products[0];

    // 4. Cek stock
    if (product.stock < quantity) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // 5. Hitung harga
    const unitPrice = Number(product.price);
    const discount = Number(product.discount);

    const subtotal = unitPrice * quantity;
    const discountAmount = subtotal * (discount / 100);
    const totalPrice = subtotal - discountAmount;

    // 6. Kurangi stock
    await connection.query(
      `UPDATE products
       SET stock = stock - ?
       WHERE id = ?`,
      [quantity, productId]
    );

    // 7. Simpan order
    const [order] = await connection.query(
      `INSERT INTO orders
       (product_id, quantity, unit_price, discount, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [
        productId,
        quantity,
        unitPrice,
        discount,
        totalPrice,
      ]
    );

    // 8. Commit transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Checkout successful",
      data: {
        orderId: order.insertId,
        productId,
        quantity,
        unitPrice,
        discount,
        totalPrice,
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error("Checkout error:", error);

    res.status(500).json({
      success: false,
      message: "Checkout failed",
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  checkout,
};