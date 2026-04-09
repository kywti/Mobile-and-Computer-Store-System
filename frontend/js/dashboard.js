document.addEventListener('DOMContentLoaded', initDashboard);

let products = [];
let users = [];
let orders = [];

async function initDashboard() {
  try {
    // Load all data
    const [productsData, usersData, ordersData] = await Promise.all([
      fetch("../../data/product.json").then(r => r.json()),
      fetch("../../data/users.json").then(r => r.json()),
      fetch("../../data/order.json").then(r => r.json())
    ]);

    products = productsData;
    users = usersData;
    orders = ordersData;

    // Update dashboard
    updateStats();
    renderTopProducts();
    renderLatestOrders();
    renderSalesChart();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

function updateStats() {
  // Total Revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  document.querySelector('.dashboard-stat:nth-child(1) h3').textContent = `DZD ${totalRevenue.toLocaleString()}`;

  // Total Orders
  document.querySelector('.dashboard-stat:nth-child(2) h3').textContent = orders.length;

  // Total Products
  document.querySelector('.dashboard-stat:nth-child(3) h3').textContent = products.length;

  // Total Users
  document.querySelector('.dashboard-stat:nth-child(4) h3').textContent = users.length;
}

function renderTopProducts() {
  // Calculate total sales per product
  const productSales = {};
  
  orders.forEach(order => {
    order.products.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = { name: item.name, totalSold: 0, totalRevenue: 0 };
      }
      productSales[item.id].totalSold += item.quantity;
      productSales[item.id].totalRevenue += item.quantity * item.price;
    });
  });

  // Get top 3 products by revenue
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 3);

  const topProductsList = document.querySelector('.top-products');
  topProductsList.innerHTML = '';

  topProducts.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} <span>DZD ${product.totalRevenue.toLocaleString()}</span>`;
    topProductsList.appendChild(li);
  });
}

function renderLatestOrders() {
  // Sort orders by date (newest first)
  const latestOrders = orders
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const ordersList = document.querySelector('.orders-list');
  ordersList.innerHTML = '';

  latestOrders.forEach(order => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';

    const statusClass = {
      'pending': 'pending',
      'processing': 'processing',
      'delivered': 'delivered'
    }[order.status] || 'pending';

    const date = new Date(order.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    // Get first product name
    const firstProduct = order.products[0]?.name || 'Multiple items';

    orderItem.innerHTML = `
      <div class="order-left">
        <p class="order-product">${firstProduct}</p>
        <span class="order-date">${date}</span>
      </div>
      <span class="order-status ${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
      <div class="order-right">
        <p class="order-price">DZD ${order.total.toLocaleString()}</p>
        <span class="order-client">${order.customerName}</span>
      </div>
    `;
    
    ordersList.appendChild(orderItem);
  });
}

function renderSalesChart() {
  // Calculate sales by category
  const categorySales = {};
  
  products.forEach(product => {
    categorySales[product.category] = categorySales[product.category] || { total: 0, count: 0 };
  });

  orders.forEach(order => {
    order.products.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        const category = product.category;
        categorySales[category] = categorySales[category] || { total: 0, count: 0 };
        categorySales[category].total += item.quantity * item.price;
        categorySales[category].count += item.quantity;
      }
    });
  });

  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categorySales),
      datasets: [{
        data: Object.values(categorySales).map(sales => sales.total),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}