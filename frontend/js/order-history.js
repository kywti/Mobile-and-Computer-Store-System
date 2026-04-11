document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("table tbody");
  const filterButtons = document.querySelectorAll(".oh-filter-button");
  const searchInput = document.querySelector(".sort-input");
  const exportBtn = document.querySelector(".export-button");

  const user = JSON.parse(localStorage.getItem("user"));
  let ordersFromStorage = JSON.parse(localStorage.getItem("orders")) || [];

  const testOrders = [
    {
      orderId: "#1001",
      email: user?.email || "user@gmail.com",
      date: "2026-04-10",
      status: "Canceled",
      total: 2500,
      items: [
        {
          name: "Motorola T720",
          quantity: 1,
          price: 2500,
          image: "../../img/phones/motorola-t720.jpg",
        },
      ],
    },
    {
      orderId: "#1002",
      email: user?.email || "test@test.com",
      date: "2026-04-09",
      status: "Processing",
      total: 4000,
      items: [
        {
          name: "Samsung SGH-E620",
          quantity: 1,
          price: 4000,
          image: "../../img/phones/Samsung-SGH-E620.jpg",
        },
      ],
    },
    {
      orderId: "#1003",
      email: user?.email || "test@test.com",
      date: "2026-04-08",
      status: "Delivered",
      total: 1800,
      items: [
        {
          name: "Sanyo VI-2300",
          quantity: 2,
          price: 900,
          image: "../../img/phones/Sanyo-VI-2300.jpg",
        },
      ],
    },
    {
      orderId: "#1003",
      email: user?.email || "test@test.com",
      date: "2026-04-08",
      status: "Out For Delivery",
      total: 1800,
      items: [
        {
          name: "Palm Z22 Color Touchscreen ",
          quantity: 7,
          price: 34560,
          image: "../../img/tablets/PALM-ZIRE-22-PDA.jpg",
        },
      ],
    },
  ];
  let orders = [...ordersFromStorage, ...testOrders];
  if (!user) {
    window.location.href = "sign_in.html";
    return;
  }

  const userOrders = orders.filter((o) => o.email === user.email);

  let currentFilter = "All Orders";
  let searchQuery = "";

  function exportOrders() {
    const userOrders = orders.filter((o) => o.email === user.email);

    if (userOrders.length === 0) {
      alert("No orders to export");
      return;
    }

    let csv = "Order ID,Date,Status,Products,Total\n";

    userOrders.forEach((order) => {
      const productNames = order.items
        .map((item) => `${item.name} (x${item.quantity})`)
        .join(" | ");

      csv += `"${order.orderId}","${order.date}","${order.status}","${productNames}","${order.total}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${user.email}.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", exportOrders);
  }

  function renderOrders() {
    tbody.innerHTML = "";

    let filtered = userOrders;

    if (currentFilter !== "All Orders") {
      filtered = filtered.filter(
        (o) => o.status.toLowerCase() === currentFilter.toLowerCase(),
      );
    }

    // SEARCH FILTER
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((order) => {
        const productNames = order.items
          .map((item) => item.name.toLowerCase())
          .join(" ");

        return (
          order.orderId.toLowerCase().includes(searchQuery) ||
          productNames.includes(searchQuery)
        );
      });
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:20px;">
            No orders found
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((order) => {
      const tr = document.createElement("tr");

      const productNames = order.items
        .map((item) => `${item.name} (x${item.quantity})`)
        .join(", ");

      const firstImage = order.items[0]?.image || "../../img/default.png";

      tr.innerHTML = `
        <td class="order-product">
          <div class="order-info">
            <img src="${firstImage}" alt="Product image" />
            <p>${productNames}</p>
          </div>
        </td>

        <td>
          <div class="client-info">
            <img src="../../img/icons/client-pfp.jpg" alt="Profile picture"/>
            <p>${user.firstName || user.email}</p>
          </div>
        </td>

        <td>${order.date}</td>
        <td>${order.orderId}</td>
        <td>
  <span class="status ${order.status.toLowerCase()}">
    ${order.status}
  </span>
</td>
        <td>DZD ${order.total.toLocaleString()}</td>
      `;

      tbody.appendChild(tr);
    });
  }

  filterButtons.forEach((btn) => {
    if (btn.textContent.trim() === "All Orders") {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      currentFilter = btn.textContent.trim();

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      renderOrders();
    });
  });

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderOrders();
  });

  renderOrders();
});
