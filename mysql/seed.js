const mysql = require('mysql2/promise');

async function seedData() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ychauhan@2102",
    database: "products"
  });

  const products = [
    { name: "phone", category: "electronics", price: 500, brand: "Samsung", stock: 120, rating: 4.5, description: "A powerful smartphone with great performance." },
    { name: "laptop", category: "electronics", price: 1000, brand: "Dell", stock: 50, rating: 4.7, description: "Lightweight laptop with long battery life." },
    { name: "headphones", category: "accessories", price: 150, brand: "Sony", stock: 200, rating: 4.3, description: "Noise-cancelling over-ear headphones." },
    { name: "tablet", category: "electronics", price: 300, brand: "Apple", stock: 80, rating: 4.6, description: "Compact tablet with retina display." },
    { name: "smartwatch", category: "wearables", price: 200, brand: "Fitbit", stock: 150, rating: 4.2, description: "Fitness tracking smartwatch with heart-rate monitor." },
    { name: "camera", category: "electronics", price: 750, brand: "Canon", stock: 40, rating: 4.8, description: "High-resolution DSLR camera." },
    { name: "keyboard", category: "accessories", price: 60, brand: "Logitech", stock: 300, rating: 4.4, description: "Mechanical keyboard with RGB backlight." },
    { name: "monitor", category: "electronics", price: 250, brand: "LG", stock: 100, rating: 4.5, description: "27-inch 4K Ultra HD monitor." }
  ];

  for (const p of products) {
    await db.execute(
      "INSERT INTO products (name, category, price, brand, stock, rating, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [p.name, p.category, p.price, p.brand, p.stock, p.rating, p.description]
    );
  }

  console.log("✅ Sample data inserted successfully");
  await db.end();
}

seedData();
