// ==========================
// ELEMENTS
// ==========================
const orderTableBody = document.getElementById('order-total-body');
const totalOrdersEl = document.getElementById('total-products');
const pendingOrdersEl = document.getElementById('low-stock');
const cancelledOrdersEl = document.getElementById('out-stock');

const searchInput = document.querySelector('.search');
const filterButtons = document.querySelectorAll('.filters button');

let allOrders = [];
let currentFilter = 'All Orders';

document.addEventListener('DOMContentLoaded', init);

// ==========================
// INIT
// ==========================
function init() {
  loadOrders();
  setupEventListeners();
}

// ==========================
// LOAD ORDERS
// ==========================
function loadOrders() {
   fetch("../../data/order.json")
    .then(res => res.json())
    .then(orders => {
      allOrders = orders.map(flattenOrderData);
      updateStats();
      renderTable(allOrders);
    })
    .catch(() => {
      orderTableBody.innerHTML = '<tr><td colspan="8">Error loading orders</td></tr>';
    });
}

// ==========================
// FLATTEN ORDER DATA
// ==========================
function flattenOrderData(order) {
  const firstProduct = order.products?.[0] || {};

  return {
    id: order.id,
    productName: firstProduct.name || "Unknown product",
    customer: order.customerName,
    date: formatDate(order.date),
    status: capitalize(order.status),
    total: order.total
  };
}

// ==========================
// HELPERS
// ==========================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

function getStatusClass(status) {
  return {
    'Pending': 'low-stock',
    'Completed': 'in-stock',
    'Cancelled': 'out-of-stock'
  }[status];
}

// ==========================
// STATS
// ==========================
function updateStats() {
  totalOrdersEl.textContent = allOrders.length;
  pendingOrdersEl.textContent = allOrders.filter(o => o.status === 'Pending').length;
  cancelledOrdersEl.textContent = allOrders.filter(o => o.status === 'Cancelled').length;
}

// ==========================
// RENDER TABLE
// ==========================
function renderTable(orders) {
  orderTableBody.innerHTML = '';

  if (!orders.length) {
    orderTableBody.innerHTML = '<tr><td colspan="8">No orders found</td></tr>';
    return;
  }

  orders.forEach(order => {
    const statusClass = getStatusClass(order.status);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img class="inventory-product-img" src="../../img/products/default.png"></td>
      <td>${order.productName}</td>
      <td>${order.customer}</td>
      <td>${order.date}</td>
      <td>#${order.id}</td>
      <td><span class="status ${statusClass}">${order.status}</span></td>
      <td>${order.total.toLocaleString()} DZD</td>
      <td>
        <div class="actions">
          <button class="action-btn more-btn">
            <img src="../../img/icons/menu-dots.png">
          </button>
          <div class="dropdown-menu">
            <button class="dropdown-item delete-btn" data-id="${order.id}">
              <img src="../../img/icons/delete.png"> Delete Order
            </button>
          </div>
        </div>
      </td>
    `;
    orderTableBody.appendChild(row);
  });

  attachTableEventListeners();
}

// ==========================
// FILTERS
// ==========================
function filterOrders(orders, filter) {
  if (filter === 'Pending') return orders.filter(o => o.status === 'Pending');
  if (filter === 'Completed') return orders.filter(o => o.status === 'Completed');
  if (filter === 'Cancelled') return orders.filter(o => o.status === 'Cancelled');
  return orders;
}

// ==========================
// SEARCH
// ==========================
function applySearch(orders) {
  const term = searchInput.value.toLowerCase().trim();
  if (!term) return orders;

  return orders.filter(o =>
    o.productName.toLowerCase().includes(term) ||
    o.customer.toLowerCase().includes(term)
  );
}

// ==========================
// EVENTS
// ==========================
function setupEventListeners() {

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.textContent;

      let filtered = filterOrders(allOrders, currentFilter);
      filtered = applySearch(filtered);
      renderTable(filtered);
    });
  });

  searchInput.addEventListener('input', debounce(() => {
    let filtered = filterOrders(allOrders, currentFilter);
    filtered = applySearch(filtered);
    renderTable(filtered);
  }, 300));
}

// ==========================
// TABLE BUTTONS
// ==========================
function attachTableEventListeners() {

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      deleteOrder(id);
    });
  });

  document.querySelectorAll('.more-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeAllDropdowns();
      const menu = this.nextElementSibling;
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.transform = 'translateY(0)';
    });
  });

  document.addEventListener('click', closeAllDropdowns);
}

function deleteOrder(id) {
  allOrders = allOrders.filter(o => o.id !== id);
  updateStats();
  renderTable(allOrders);
}

// ==========================
// UTIL
// ==========================
function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transform = 'translateY(-10px)';
  });
}

function debounce(func, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => func(...args), wait);
  };
}