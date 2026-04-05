function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();

  const existing = cart.find(
    (item) => item.id === product.id && item.color === product.color,
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push(product);
  }

  saveCart(cart);
}

function removeFromCart(id, color) {
  let cart = getCart();

  cart = cart.filter((item) => !(item.id === id && item.color === color));

  saveCart(cart);
}

function updateQuantity(id, color, change) {
  let cart = getCart();

  const item = cart.find((item) => item.id === id && item.color === color);

  if (!item) {
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(id, color);
  }

  saveCart(cart);
}

function getTotalPrice() {
  const cart = getCart();

  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}
