const express = require('express');
const fs = require('fs');
const app = express();

const port = 4200;

// Middleware to parse JSON body
app.use(express.json());

function readProducts() {
  return JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
}

function writeProducts(data) {
  fs.writeFileSync('./data/products.json', JSON.stringify(data, null, 2));
}

// Default route
app.get('/', (req, res) => {
  res.end('<h1>Welcome to Products Node Express App</h1>');
});

// GET by name
app.get('/:name', (req, res) => {
  try {
    const data = readProducts();
    const itemName = req.params.name;
    const item = data.find(p => p.name.toLowerCase() === itemName.toLowerCase());

    if (item) {
      let output = '<h1>Product Details:</h1><br>';
      for (const [key, value] of Object.entries(item)) {
        output += `${key}: ${value}<br>`;
      }
      res.end(output);
    } else {
      res.end(`<h1>${itemName} not found</h1>`);
    }
  } catch (err) {
    console.error(err);
    res.end('<h1>Error reading products</h1>');
  }
});

// POST → Add new product
app.post('/add', (req, res) => {
  try {
    const data = readProducts();
    data.push(req.body);
    writeProducts(data);
    res.json({ message: 'Product added successfully', product: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding product' });
  }
});

// PUT → Update product by name
app.put('/:name', (req, res) => {
  try {
    const data = readProducts();
    const itemName = req.params.name.toLowerCase();
    const index = data.findIndex(p => p.name.toLowerCase() === itemName);

    if (index !== -1) {
      data[index] = { ...data[index], ...req.body };
      writeProducts(data);
      res.json({ message: 'Product updated successfully', product: data[index] });
    } else {
      res.status(404).json({ message: `${req.params.name} not found` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// DELETE → Remove product by name
app.delete('/:name', (req, res) => {
  try {
    let data = readProducts();
    const itemName = req.params.name.toLowerCase();
    const newData = data.filter(p => p.name.toLowerCase() !== itemName);

    if (newData.length === data.length) {
      return res.status(404).json({ message: `${req.params.name} not found` });
    }

    writeProducts(newData);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

app.listen(port, () => {
  console.log(`Node Express Server is listening on port ${port}`);
});
