const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// MongoDB connection
mongoose.connect('mongodb://localhost/inventory', { useNewUrlParser: true, useUnifiedTopology: true });

// Models
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  quantity: Number,
  sales: Number,
  profit: Number,
}));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API routes
app.post('/login', async (req, res) => {
  const { username, pin } = req.body;
  // Authentication logic here
  res.send('Login successful');
});

app.post('/update-product', async (req, res) => {
  const { id, quantity, sales, profit } = req.body;
  const product = await Product.findById(id);
  if (!product) return res.status(404).send('Product not found');

  product.quantity -= quantity; // Subtract sold items
  product.sales += sales; // Update sales
  product.profit += profit; // Update profit
  await product.save();
  io.emit('product-updated', product);
  res.send('Product updated');
});

// Server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
