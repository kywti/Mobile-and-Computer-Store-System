document.addEventListener("DOMContentLoaded", initDashboard);

let allProducts = [];
let allOrders = [];
let allUsers = [];

function initDashboard() {
  Promise.all([
    fetch("../../data/product.json").then((res) => res.json()),
    fetch("../../data/order.json").then((res) => res.json()),
    fetch("../../data/user.json").then((res) => res.json()),
  ])
    .then(([products, orders, users]) => {
      allProducts = products.map(flattenProductData);
      allOrders = orders.map(flattenOrderData);
      allUsers = users.map((u) => ({ ...u, status: "ACTIVE" }));

      updateDashboardStats();
      renderTopProducts();
      renderLatestOrders();
      renderSalesChart();
      addStatBoxClickHandlers();
    })
    .catch((err) => console.error("Error loading dashboard:", err));
}

function addStatBoxClickHandlers() {
  const totalOrdersBox = document.querySelector(
    ".dashboard-stat:has(#total-orders)",
  );
  if (totalOrdersBox) {
    totalOrdersBox.style.cursor = "pointer";
    totalOrdersBox.addEventListener("click", () => {
      window.location.href = "orderManagment.html";
    });

    totalOrdersBox.addEventListener("mouseenter", () => {
      totalOrdersBox.style.opacity = "0.8";
    });
    totalOrdersBox.addEventListener("mouseleave", () => {
      totalOrdersBox.style.opacity = "1";
    });
  }

  const totalProductsBox = document.querySelector(
    ".dashboard-stat:has(#total-products)",
  );
  if (totalProductsBox) {
    totalProductsBox.style.cursor = "pointer";
    totalProductsBox.addEventListener("click", () => {
      window.location.href = "InventoryManagement.html";
    });

    totalProductsBox.addEventListener("mouseenter", () => {
      totalProductsBox.style.opacity = "0.8";
    });
    totalProductsBox.addEventListener("mouseleave", () => {
      totalProductsBox.style.opacity = "1";
    });
  }

  const totalUsersBox = document.querySelector(
    ".dashboard-stat:has(#total-users)",
  );
  if (totalUsersBox) {
    totalUsersBox.style.cursor = "pointer";
    totalUsersBox.addEventListener("click", () => {
      window.location.href = "userManagment.html";
    });

    totalUsersBox.addEventListener("mouseenter", () => {
      totalUsersBox.style.opacity = "0.8";
    });
    totalUsersBox.addEventListener("mouseleave", () => {
      totalUsersBox.style.opacity = "1";
    });
  }
}

function formatDZD(amount) {
  return `${amount.toLocaleString()} DZD`;
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function flattenProductData(product) {
  let stock = 0;
  let image = "";

  if (product.variants?.length) {
    const v = product.variants[0];
    stock = v.stock ?? product.stock ?? 0;
    image = v.images?.[0] || "";
  } else {
    stock = product.stock ?? 0;
    image = product.image || "";
  }

  return {
    id: product.id,
    name: product.name,
    category: capitalize(product.category),
    stock,
    price: product.price,
    supplier: product.manufacturer || "N/A",
    image,
  };
}

function flattenOrderData(order) {
  return {
    id: order.orderId,
    products: order.products || [],
    customer: order.customerName,
    email: order.customerEmail || "",
    date: new Date(order.date),
    status: capitalize(order.status),
    total: order.total,
  };
}

function updateDashboardStats() {
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  document.getElementById("total-revenue").textContent =
    formatDZD(totalRevenue);

  document.getElementById("total-orders").textContent = allOrders.length;
  document.getElementById("total-products").textContent = allProducts.length;
  document.getElementById("total-users").textContent = allUsers.length;
}

function renderTopProducts() {
  const revenueMap = {};

  allOrders.forEach((order) => {
    order.products.forEach((item) => {
      const price = item.price || 0;

      const product = allProducts.find((p) => p.id == item.id);

      if (!product) return;

      if (!revenueMap[item.id]) {
        revenueMap[item.id] = {
          id: product.id,
          name: product.name,
          image: product.image || "../../img/icons/no-image.png",
          revenue: 0,
        };
      }

      revenueMap[item.id].revenue += price * item.quantity;
    });
  });

  const topProducts = Object.values(revenueMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  const container = document.getElementById("top-products");
  container.innerHTML = "";

  if (!topProducts.length) {
    container.innerHTML = "<li>No sales data</li>";
    return;
  }

  topProducts.forEach((p) => {
    const li = document.createElement("li");

    const imgSrc =
      p.image && p.image.trim() !== ""
        ? p.image
        : "../../img/icons/no-image.png";

    li.innerHTML = `
      <div class="product-item">
        <img src="${imgSrc}"
             onerror="this.src='../../img/icons/no-image.png'"
             alt="${p.name}">
        <div class="product-info">
          <span class="product-name">${p.name}</span>
          <span class="product-revenue">${formatDZD(p.revenue)}</span>
        </div>
      </div>
    `;

    container.appendChild(li);
  });
}

function renderLatestOrders() {
  const container = document.getElementById("latest-orders");
  container.innerHTML = "";

  const latest = [...allOrders].sort((a, b) => b.date - a.date).slice(0, 3);

  latest.forEach((order) => {
    const firstProduct = order.products?.[0] || {};

    const div = document.createElement("div");
    div.className = "order-item";

    div.innerHTML = `
      <div class="order-left">
        <p class="order-product">${firstProduct.name || "Unknown"}</p>
        <span class="order-date">${order.date.toLocaleDateString()}</span>
      </div>

      <span class="order-status ${order.status.toLowerCase()}">
        ${order.status}
      </span>

      <div class="order-right">
        <p class="order-price">${formatDZD(order.total)}</p>
        <span class="order-client">${order.customer}</span>
      </div>
    `;

    container.appendChild(div);
  });
}

function renderSalesChart() {
  const categorySales = {};

  allOrders.forEach((order) => {
    order.products.forEach((item) => {
      const product = allProducts.find((p) => p.id == item.id);
      if (!product) return;

      const category = product.category;

      categorySales[category] = (categorySales[category] || 0) + item.quantity;
    });
  });

  const ctx = document.getElementById("chart").getContext("2d");

  if (window.salesChart) {
    window.salesChart.destroy();
  }

  window.salesChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(categorySales),
      datasets: [
        {
          data: Object.values(categorySales),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
