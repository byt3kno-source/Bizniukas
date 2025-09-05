const socket = io();

// Listen for product updates
socket.on('product-updated', function(product) {
  console.log('Product updated:', product);
  updateProductList();
});

// Function to update product list
function updateProductList() {
  fetch('/products')
    .then(response => response.json())
    .then(products => {
      const productList = document.getElementById('product-list');
      productList.innerHTML = '';
      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
          <h3>${product.name}</h3>
          <p>Quantity: ${product.quantity}</p>
          <p>Sales: ${product.sales}</p>
          <p>Profit: ${product.profit}€</p>
          <button onclick="sellProduct('${product._id}')">Sell</button>
          <button onclick="takeProduct('${product._id}')">Take for myself</button>
        `;
        productList.appendChild(productCard);
      });
    });
}

function sellProduct(productId) {
  const quantity = prompt('How many units sold?');
  const price = prompt('What is the sale price?');
  fetch('/update-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: productId,
      quantity: quantity,
      sales: parseInt(quantity),
      profit: parseInt(price) * parseInt(quantity),
    })
  }).then(() => updateProductList());
}

function takeProduct(productId) {
  const quantity = prompt('How many units will you take for yourself?');
  fetch('/update-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: productId,
      quantity: quantity,
      sales: 0,
      profit: 0,
    })
  }).then(() => updateProductList());
}

updateProductList(); // Initial loading
