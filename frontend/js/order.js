const orderTableBody = document.getElementById('order-total-body');
const totalOrdersEl = document.getElementById('total-order');
const pendingOrdersEl = document.getElementById('Pending-order');
const cancelledOrdersEl = document.getElementById('Cancelled-order');

const searchInput = document.querySelector('.search');
const filterButtons = document.querySelectorAll('.filters button');
const exportBtn = document.querySelector('.export-btn');

let allOrders = [];
let currentFilter = 'All Order';

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadOrders();
  setupEventListeners();
}

function loadOrders() {
  fetch("../../data/order.json")
    .then(res => res.json())
    .then(orders => {
     console.log(orders); 
     allOrders = orders.map(flattenOrderData);
     updateStats();
     renderTable(allOrders);
})
    .catch(() => {
      orderTableBody.innerHTML = '<tr><td colspan="8">Error loading orders</td></tr>';
    });
}

function flattenOrderData(order) {
  const firstProduct = order.products[0] || { name: 'N/A' };
  
  return {
    id: order.id,
    productName: firstProduct.name,
    client: order.customerName,
    date: order.date,
    orderId: `#${order.id.toString().padStart(4, '0')}`,
    status: order.status,
    price: order.total,
    products: order.products, 
    customerId: order.customerId
  };
}

function getStatusClass(status) {
  const statusMap = {
    'pending': 'pending',
    'processing': 'processing',
    'delivered': 'delivered',
    'cancelled': 'cancelled',
    'out for delivery': 'delivered'
  };
  return statusMap[status.toLowerCase()] || 'pending';
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatCurrency(amount) {
  return `$${Math.round(amount).toLocaleString()}`;
}

function updateStats() {
  totalOrdersEl.textContent = allOrders.length;

  pendingOrdersEl.textContent = allOrders.filter(o => 
    o.status.toLowerCase().includes('pending')
  ).length;

  cancelledOrdersEl.textContent = allOrders.filter(o => 
    o.status.toLowerCase().includes('cancel')
  ).length;
}

function renderTable(orders) {
  orderTableBody.innerHTML = '';

  if (!orders.length) {
    orderTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No orders found</td></tr>';
    return;
  }

  orders.forEach(order => {
    const statusClass = getStatusClass(order.status);
    const statusDisplay = order.status.charAt(0).toUpperCase() + order.status.slice(1);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="product-image-container">
          <img class="inventory-product-img" src="../../img/icons/no-image.png" alt="Product">
        </div>
      </td>
      <td>${order.productName}</td>
      <td>${order.client}</td>
      <td>${formatDate(order.date)}</td>
      <td>${order.orderId}</td>
      <td><span class="status ${statusClass}">${statusDisplay}</span></td>
      <td>${formatCurrency(order.price)}</td>
      <td>
        <div class="actions">
          <button class="action-btn more-btn">
            <img src="../../img/icons/menu-dots.png" alt="More">
          </button>
          <div class="dropdown-menu">
            <button class="dropdown-item view-btn" data-id="${order.id}">
              <img src="../../img/icons/eye.png" alt="View"> View Details
            </button>
            <button class="dropdown-item edit-status-btn" data-id="${order.id}">
              <img src="../../img/icons/edit.png" alt="Edit"> Update Status
            </button>
            <button class="dropdown-item invoice-btn" data-id="${order.id}">
              <img src="../../img/icons/document.png" alt="Invoice"> Generate Invoice
            </button>
          </div>
        </div>
      </td>
    `;
    orderTableBody.appendChild(row);
  });

  attachTableEventListeners();
}

function filterOrders(orders, filter) {
  switch(filter) {
    case 'Pending': return orders.filter(o => o.status.toLowerCase() === 'pending');
    case 'Processing': return orders.filter(o => o.status.toLowerCase() === 'processing');
    case 'Out For Delivery': return orders.filter(o => o.status.toLowerCase().includes('delivery'));
    case 'Delivered': return orders.filter(o => o.status.toLowerCase() === 'delivered');
    case 'Cancelled': return orders.filter(o => o.status.toLowerCase() === 'cancelled');
    default: return orders;
  }
}

function applySearch(orders) {
  const term = searchInput.value.toLowerCase().trim();
  if (!term) return orders;

  return orders.filter(order =>
    order.productName.toLowerCase().includes(term) ||
    order.client.toLowerCase().includes(term) ||
    order.orderId.toLowerCase().includes(term)
  );
}

// ============================================================================
// EVENT LISTENERS (SAME STRUCTURE AS INVENTORY)
// ============================================================================
function setupEventListeners() {
  // Filter buttons
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

  // Search input
  searchInput.addEventListener('input', debounce(() => {
    let filtered = filterOrders(allOrders, currentFilter);
    filtered = applySearch(filtered);
    renderTable(filtered);
  }, 300));

  // Export button
  if (exportBtn) {
    exportBtn.addEventListener('click', exportOrders);
  }
}

function attachTableEventListeners() {
  // View details
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      const order = allOrders.find(o => o.id === id);
      if (order) showOrderDetails(order);
    });
  });

  // Edit status
  document.querySelectorAll('.edit-status-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      updateOrderStatus(id);
    });
  });

  // Invoice
  document.querySelectorAll('.invoice-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      generateInvoice(id);
    });
  });

  // Dropdown menus
  document.querySelectorAll('.more-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeAllDropdowns();
      const menu = this.nextElementSibling;
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.transform = 'translateY(0)';
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', closeAllDropdowns);
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transform = 'translateY(-10px)';
  });
}

// ============================================================================
// ORDER ACTIONS
// ============================================================================
function showOrderDetails(order) {
  const productsList = order.products.map(p => 
    `• ${p.name} (x${p.quantity}) - ${formatCurrency(p.price * p.quantity)}`
  ).join('\n');
  
  const details = `
Order ${order.orderId}
Customer: ${order.client}
Date: ${formatDate(order.date)}
Status: ${order.status.toUpperCase()}

PRODUCTS:
${productsList}

TOTAL: ${formatCurrency(order.price)}
  `;
  
  alert(details);
}

function updateOrderStatus(orderId) {
  const order = allOrders.find(o => o.id === orderId);
  if (!order) return;

  const statuses = ['pending', 'processing', 'out for delivery', 'delivered', 'cancelled'];
  const currentIndex = statuses.indexOf(order.status.toLowerCase());
  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
  
  // Update (demo - replace with API)
  const orderIndex = allOrders.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    allOrders[orderIndex].status = nextStatus;
    updateStats();
    renderTable(filterOrders(allOrders, currentFilter));
    alert(`Order ${order.orderId} status updated to: ${nextStatus}`);
  }
}

function generateInvoice(orderId) {
  const order = allOrders.find(o => o.id === orderId);
  if (order) {
    // Demo invoice generation
    const invoiceData = {
      id: order.orderId,
      customer: order.client,
      items: order.products.length,
      total: formatCurrency(order.price),
      date: new Date().toLocaleDateString()
    };
    console.log('Invoice generated:', invoiceData);
    alert(`Invoice generated for ${order.orderId}\nTotal: ${formatCurrency(order.price)}`);
    
    // Real implementation: 
    // window.open(`/invoice/${orderId}`, '_blank');
  }
}

function exportOrders() {
  const filteredOrders = filterOrders(allOrders, currentFilter);
  const exportData = filteredOrders.map(order => ({
    ID: order.orderId,
    Customer: order.client,
    Product: order.productName,
    Date: formatDate(order.date),
    Status: order.status,
    Total: formatCurrency(order.price)
  }));

  // Download CSV
  const csv = convertToCSV(exportData);
  downloadCSV(csv, `orders-${new Date().toISOString().split('T')[0]}.csv`);
}

function convertToCSV(data) {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => `"${value}"`).join(',')
  );
  return [headers, ...rows].join('\n');
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}