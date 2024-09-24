let products = []; 
let cart = [];


const fetchProducts = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};


const displayProducts = (productsToDisplay) => {
  const productContainer = document.querySelector('.products');
  productContainer.innerHTML = ''; 

  productsToDisplay.forEach(product => {
    const productCard = `
      <div class="products-card">
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>★ ${product.rating.rate}</p>
        <p>₹${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    productContainer.innerHTML += productCard;
  });
};

const addToCart = (productId) => {
  const product = products.find(p => p.id === productId); 
  const productInCart = cart.find(item => item.id === product.id);

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartDisplay();
};

const changeQuantity = (productId, action) => {
  cart = cart.map(item => {
    if (item.id === productId) {
      if (action === 'increase') {
        item.quantity += 1;
      } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
      }
    }
    return item;
  });

  updateCartDisplay();
};

const removeFromCart = (productId) => {
  cart = cart.filter(item => item.id !== productId);
  updateCartDisplay();
};


const updateCartDisplay = () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  cartItemsContainer.innerHTML = ''; 

  cart.forEach(item => {
    const cartItem = `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" width="50">
        <p>${item.title}</p>
        <p>₹${item.price}</p>
        <div>
          <button onclick="changeQuantity(${item.id}, 'decrease')">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 'increase')">+</button>
        </div>
        <button onclick="removeFromCart(${item.id})">X</button>
      </div>
    `;
    cartItemsContainer.innerHTML += cartItem;
  });

  calculateTotal();
};


const calculateTotal = () => {
  const totalMRP = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = 50; 
  const platformFee = 10;
  const shippingCharges = 20;
  const totalAmount = totalMRP - discount + platformFee + shippingCharges;

  document.getElementById('total-mrp').textContent = `₹${totalMRP}`;
  document.getElementById('discount').textContent = `₹${discount}`;
  document.getElementById('platform-fee').textContent = `₹${platformFee}`;
  document.getElementById('shipping').textContent = `₹${shippingCharges}`;
  document.getElementById('total-amount').textContent = `₹${totalAmount}`;
};


const searchProducts = (searchTerm) => {
  const searchResults = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayProducts(searchResults); 
};

document.querySelector('#search-bar').addEventListener('input', (e) => {
  searchProducts(e.target.value);
});

fetchProducts();
