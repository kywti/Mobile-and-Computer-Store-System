
const orderTableBody = document.getElementById('order-total-body');

const totalOrdersEl = document.getElementById('total-products'); 
const pendingOrdersEl = document.getElementById('low-stock'); 
const cancelledOrdersEl = document.getElementById('out-stock'); 

const searchInput = document.querySelector('.search');
const filterButtons = document.querySelectorAll('.filters button');

let orders = [];
let currentFilter = "all";

async function loadOrders() {
  try {
    const response = await fetch('../../data/order.json'); 
    if (!response.ok) throw new Error("Failed to load JSON");

    orders = await response.json();

    displayOrders(orders);
    updateStats();
  } catch (error) {
    console.error("Error loading orders:", error);
  }
}

function displayOrders(data) {
  orderTableBody.innerHTML = "";

  data.forEach(order => {
    const productNames = order.products.map(p => p.name).join(", ");

    const row = `
      <tr>
        <td><input type="checkbox"></td>
        <td>${productNames}</td>
        <td>${order.customerName}</td>
        <td>${order.date}</td>
        <td>#${order.id}</td>
        <td class="status ${order.status}">${order.status}</td>
        <td>${order.total} DA</td>
        <td><button>View</button></td>
      </tr>
    `;

    orderTableBody.innerHTML += row;
  });
}

// ===== STATS =====
function updateStats() {
  const total = orders.length;
  const pending = orders.filter(o => o.status === "pending").length;
  const cancelled = orders.filter(o => o.status === "cancelled").length;

  totalOrdersEl.textContent = total;
  pendingOrdersEl.textContent = pending;
  cancelledOrdersEl.textContent = cancelled;
}

// ===== FILTER BUTTONS =====
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filters .active')?.classList.remove('active');
    button.classList.add('active');

    const text = button.textContent.toLowerCase();

    if (text.includes("all")) currentFilter = "all";
    else if (text.includes("pending")) currentFilter = "pending";
    else if (text.includes("processing")) currentFilter = "processing";
    else if (text.includes("out")) currentFilter = "out for delivery";
    else if (text.includes("delivered")) currentFilter = "delivered";
    else if (text.includes("cancelled")) currentFilter = "cancelled";

    applyFilters();
  });
});

// ===== SEARCH =====
searchInput.addEventListener('input', applyFilters);

// ===== APPLY FILTER + SEARCH =====
function applyFilters() {
  let filtered = [...orders];

  // FILTER BY STATUS
  if (currentFilter !== "all") {
    filtered = filtered.filter(o => o.status === currentFilter);
  }

  // SEARCH BY ID OR PRODUCT NAME
  const value = searchInput.value.toLowerCase();

  if (value) {
    filtered = filtered.filter(order => {
      const matchId = order.id.toString().includes(value);

      const matchProduct = order.products.some(p =>
        p.name.toLowerCase().includes(value)
      );

      return matchId || matchProduct;
    });
  }

  displayOrders(filtered);
}

// ===== INIT =====
loadOrders();