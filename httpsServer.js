const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 3000;

function readProducts() {
  return JSON.parse(fs.readFileSync('products.json', 'utf-8'));
}

function writeProducts(data) {
  fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  // -------- GET ALL PRODUCTS --------
  if (req.method === 'GET' && req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Welcome to Products Node HTTP App</h1>');
  }

  else if (req.method === 'GET') {
    const name = req.url.slice(1);
    try {
      const data = readProducts();
      const item = data.find(p => p.name.toLowerCase() === name.toLowerCase());

      if (item) {
        let output = '<h1>Product Details:</h1><br>';
        for (const [key, value] of Object.entries(item)) {
          output += `${key}: ${value}<br>`;
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(output);
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.end(`<h1>${name} not found</h1>`);
      }
    } catch (err) {
      console.error(err);
      res.end(JSON.stringify({ error: 'Error reading products' }));
    }
  }

  // -------- ADD PRODUCT (POST /add) --------
  else if (req.method === 'POST' && req.url === '/add') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const newProduct = JSON.parse(body);
        const data = readProducts();
        data.push(newProduct);
        writeProducts(data);
        res.end(JSON.stringify({ message: 'Product added', product: newProduct }));
      } catch (err) {
        console.error(err);
        res.end(JSON.stringify({ error: 'Error adding product' }));
      }
    });
  }

  // -------- UPDATE PRODUCT (PUT /:name) --------
  else if (req.method === 'PUT') {
    const name = req.url.slice(1);
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        const data = readProducts();
        const index = data.findIndex(p => p.name.toLowerCase() === name.toLowerCase());

        if (index !== -1) {
          data[index] = { ...data[index], ...updates };
          writeProducts(data);
          res.end(JSON.stringify({ message: 'Product updated', product: data[index] }));
        } else {
          res.end(JSON.stringify({ error: `${name} not found` }));
        }
      } catch (err) {
        console.error(err);
        res.end(JSON.stringify({ error: 'Error updating product' }));
      }
    });
  }

  // -------- DELETE PRODUCT (DELETE /:name) --------
  else if (req.method === 'DELETE') {
    const name = req.url.slice(1);
    try {
      let data = readProducts();
      const newData = data.filter(p => p.name.toLowerCase() !== name.toLowerCase());

      if (newData.length === data.length) {
        res.end(JSON.stringify({ error: `${name} not found` }));
      } else {
        writeProducts(newData);
        res.end(JSON.stringify({ message: 'Product deleted' }));
      }
    } catch (err) {
      console.error(err);
      res.end(JSON.stringify({ error: 'Error deleting product' }));
    }
  }

  // -------- INVALID ROUTE --------
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(port, () => {
  console.log(`Node HTTP Server is listening on port ${port}`);
});
