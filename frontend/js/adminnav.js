const dashboardButton = document.querySelector(".header-button:nth-child(1)");
if (dashboardButton && dashboardButton.textContent.trim() === "DASHBOARD") {
  dashboardButton.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
}

const ordersButton = document.querySelector(".header-button:nth-child(2)");
if (ordersButton && ordersButton.textContent.trim() === "ORDERS") {
  ordersButton.addEventListener("click", () => {
    window.location.href = "orderManagment.html";
  });
}

const inventoryButton = document.querySelector(".header-button:nth-child(3)");
if (inventoryButton && inventoryButton.textContent.trim() === "INVENTORY") {
  inventoryButton.addEventListener("click", () => {
    window.location.href = "InventoryManagement.html";
  });
}

const customersButton = document.querySelector(".header-button:nth-child(4)");
if (customersButton && customersButton.textContent.trim() === "CUSTOMERS") {
  customersButton.addEventListener("click", () => {
    window.location.href = "userManagment.html";
  });
}

const profileButton = document.querySelector(".profile-button");
if (profileButton) {
  profileButton.addEventListener("click", () => {
    window.location.href = "../admin/admin-profile.html";
  });
}
