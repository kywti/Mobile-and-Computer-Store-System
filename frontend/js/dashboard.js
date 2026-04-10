let allUsers = [];
let allProducts = [];
let allOrders = [];

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadData();
}

function loadData() {
  Promise.all([
    fetch("../../data/users.json").then(res => res.json()),
    fetch("../../data/products.json").then(res => res.json()),
    fetch("../../data/orders.json").then(res => res.json())
  ])
  .then(([users, products, orders]) => {
    allUsers = users;
    allProducts = products;
    allOrders = orders;

    updateStats();
    renderTopProducts();
    renderLatestOrders();
    renderChart();

  })
  .catch(err => {
    console.error("Error loading dashboard data:", err);
  });
}


// =========================
// STATS SECTION
// =========================
function updateStats() {
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  document.getElementById("total-users").textContent = allUsers.length;
  document.getElementById("total-products").textContent = allProducts.length;
  document.getElementById("total-orders").textContent = allOrders.length;
  document.getElementById("total-revenue").textContent = totalRevenue.toLocaleString() + " DZD";
}


// =========================
// TOP PRODUCTS
// =========================
function renderTopProducts() {
  const sales = {};

  allOrders.forEach(order => {
    order.products.forEach(item => {
      sales[item.id] = (sales[item.id] || 0) + item.quantity;
    });
  });

  const sorted = Object.entries(sales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const container = document.getElementById("top-products");
  container.innerHTML = "";

  sorted.forEach(([id, qty]) => {
    const product = allProducts.find(p => p.id == id);
    if (!product) return;

    const li = document.createElement("li");
    li.innerHTML = `${product.name} <span>${qty} sold</span>`;
    container.appendChild(li);
  });
}


// =========================
// LATEST ORDERS
// =========================
function renderLatestOrders() {
  const container = document.getElementById("latest-orders");
  container.innerHTML = "";

  const latest = [...allOrders].slice(-3).reverse();

  latest.forEach(order => {
    const div = document.createElement("div");
    div.classList.add("order-item");

    const firstProduct = order.products[0];

    div.innerHTML = `
      <div class="order-left">
        <p class="order-product">${firstProduct.name}</p>
        <span class="order-date">${order.date}</span>
      </div>

      <span class="order-status ${order.status.toLowerCase()}">
        ${order.status}
      </span>

      <div class="order-right">
        <p class="order-price">${order.total.toLocaleString()} DZD</p>
        <span class="order-client">${order.customerName}</span>
      </div>
    `;

    container.appendChild(div);
  });
}


// =========================
// CHART (CATEGORY SALES)
// =========================
function renderChart() {
  const categorySales = {};

  allOrders.forEach(order => {
    order.products.forEach(item => {
      const product = allProducts.find(p => p.id == item.id);
      if (!product) return;

      const category = product.category;

      categorySales[category] =
        (categorySales[category] || 0) + item.quantity;
    });
  });

  new Chart(document.getElementById("chart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(categorySales),
      datasets: [{
        data: Object.values(categorySales)
      }]
    }
  });
}