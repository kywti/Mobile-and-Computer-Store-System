const orderTableBody = document.getElementById("order-total-body");
const totalOrdersEl = document.getElementById("total-products");
const pendingOrdersEl = document.getElementById("low-stock");
const cancelledOrdersEl = document.getElementById("out-stock");

const searchInput = document.querySelector(".search");
const filterButtons = document.querySelectorAll(".filters button");

const exportBtn = document.querySelector(".export-btn");

if (exportBtn) {
  exportBtn.addEventListener("click", exportCSV);
}

let allOrders = [];
let currentFilter = "All Orders";

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadOrders();
  setupEventListeners();
}

function loadOrders() {
  fetch("../../data/order.json")
    .then((res) => res.json())
    .then((orders) => {
      allOrders = orders.map(flattenOrderData);
      updateStats();
      renderTable(allOrders);
    })
    .catch(() => {
      orderTableBody.innerHTML =
        '<tr><td colspan="8">Error loading orders</td></tr>';
    });
}

function flattenOrderData(order) {
  const productNames = order.products
    .map((p) => `${p.name} (x${p.quantity})`)
    .join(", ");

  return {
    id: order.orderId,
    productName: productNames,
    customer: order.customerName,
    date: formatDate(order.date),
    status: capitalize(order.status),
    total: order.total,
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

function getStatusClass(status) {
  return {
    Pending: "low-stock",
    Completed: "in-stock",
    Canceled: "out-of-stock",
  }[status];
}

function updateStats() {
  totalOrdersEl.textContent = allOrders.length;
  pendingOrdersEl.textContent = allOrders.filter(
    (o) => o.status === "Pending",
  ).length;
  cancelledOrdersEl.textContent = allOrders.filter(
    (o) => o.status === "Canceled",
  ).length;
}

function renderTable(orders) {
  orderTableBody.innerHTML = "";

  if (!orders.length) {
    orderTableBody.innerHTML = '<tr><td colspan="8">No orders found</td></tr>';
    return;
  }

  orders.forEach((order) => {
    const statusClass = getStatusClass(order.status);

    const row = document.createElement("tr");
    row.innerHTML = `
    
      <td>${order.productName}</td>
      <td>${order.customer}</td>
      <td>${order.date}</td>
      <td>#${order.id}</td>
      <td><span class="status ${statusClass}">${order.status}</span></td>
      <td>${order.total.toLocaleString()} DZD</td>
      <td>
        <div class="actions">
          <button class="action-btn more-btn">
            <img src="../../img/icons/menu-dots-white.png">
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

function filterOrders(orders, filter) {
  if (filter === "Pending") return orders.filter((o) => o.status === "Pending");

  if (filter === "Processing")
    return orders.filter((o) => o.status === "Processing");

  if (filter === "Out For Delivery")
    return orders.filter((o) => o.status === "Out For Delivery");

  if (filter === "Delivered")
    return orders.filter((o) => o.status === "Delivered");

  if (filter === "Canceled")
    return orders.filter((o) => o.status === "Canceled"); // matches JSON spelling

  return orders;
}

function applySearch(orders) {
  const term = searchInput.value.toLowerCase().trim();
  if (!term) return orders;

  return orders.filter((o) => {
    return (
      o.id.toString().includes(term) ||
      o.productName.toLowerCase().includes(term) ||
      o.customer.toLowerCase().includes(term) ||
      o.status.toLowerCase().includes(term)
    );
  });
}

function setupEventListeners() {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.textContent;

      let filtered = filterOrders(allOrders, currentFilter);
      filtered = applySearch(filtered);
      renderTable(filtered);
    });
  });

  searchInput.addEventListener(
    "input",
    debounce(() => {
      let filtered = filterOrders(allOrders, currentFilter);
      filtered = applySearch(filtered);
      renderTable(filtered);
    }, 300),
  );
}

function attachTableEventListeners() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      deleteOrder(id);
    });
  });

  document.querySelectorAll(".more-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns();
      const menu = this.nextElementSibling;
      menu.style.opacity = "1";
      menu.style.visibility = "visible";
      menu.style.transform = "translateY(0)";
    });
  });

  document.addEventListener("click", closeAllDropdowns);
}

function deleteOrder(id) {
  allOrders = allOrders.filter((o) => o.id !== id);
  updateStats();
  renderTable(allOrders);
}

function exportCSV() {
  const rows = allOrders.map((o) => {
    return [o.id, o.customer, o.date, o.status, o.productName, o.total];
  });

  let csv = "Order ID,Customer,Date,Status,Product,Total\n";

  rows.forEach((r) => {
    csv += `"${r[0]}","${r[1]}","${r[2]}","${r[3]}","${r[4]}","${r[5]}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "orders_export.csv";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.style.opacity = "0";
    menu.style.visibility = "hidden";
    menu.style.transform = "translateY(-10px)";
  });
}

function debounce(func, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => func(...args), wait);
  };
}
