const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 8081;

// Middleware
app.use(express.json());

// ✅ Setup DB connection
let db;
async function connectDB() {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ychauhan@2102",
    database: "products"
  });
  console.log("✅ MySQL connected successfully");
}
connectDB();

// Default route
app.get('/', (req, res) => {
  res.end('<h1>Welcome to Products Node Express + MySQL App</h1>');
});

// GET all data
app.get('/all', async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error fetching products' });
  }
});

// GET by name
app.get('/:name', async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products WHERE LOWER(name) = ?", [req.params.name.toLowerCase()]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: `${req.params.name} not found` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// POST → Add new product
app.post('/add', async (req, res) => {
  try {
    const { name, category, price, brand, stock, rating, description } = req.body;

    await db.execute(
      "INSERT INTO products (name, category, price, brand, stock, rating, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, category, price, brand, stock, rating, description]
    );

    res.json({
      message: 'Product added successfully',
      product: { name, category, price, brand, stock, rating, description }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding product' });
  }
});


// PUT → Update product by name
// PUT → Update product by name
app.put('/:name', async (req, res) => {
  try {
    const { category, price, brand, stock, rating, description } = req.body;

    const [result] = await db.execute(
      `UPDATE products
       SET category = ?, price = ?, brand = ?, stock = ?, rating = ?, description = ?
       WHERE LOWER(name) = ?`,
      [category, price, brand, stock, rating, description, req.params.name.toLowerCase()]
    );

    if (result.affectedRows > 0) {
      res.json({ message: '✅ Product updated successfully' });
    } else {
      res.status(404).json({ message: `${req.params.name} not found` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error updating product' });
  }
});


// DELETE → Remove product by name
app.delete('/:name', async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM products WHERE LOWER(name) = ?", [req.params.name.toLowerCase()]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: `${req.params.name} not found` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Node Express Server is listening on port ${port}`);
});
