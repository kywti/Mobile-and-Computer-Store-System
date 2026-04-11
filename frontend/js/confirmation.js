const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));

if (!checkoutData) {
  console.error("No checkout data found");
}

const checkoutContainer = document.querySelector(".checkout-cart");
const totalDisplay = document.querySelector(".order-total h4 span:last-child");
const subTotalDisplay = document.querySelector(".sub-total span:last-child");
const shippingFeeDisplay = document.querySelector(
  ".shipping-fee span:last-child",
);

const modal = document.getElementById("successModal");
const goHomeBtn = document.getElementById("goHomeBtn");
const confirmBtn = document.querySelector(".add-to-cart-button-checkout-pg");

function displayOrder() {
  const cart = checkoutData.cart;

  checkoutContainer.innerHTML = "";

  if (!cart || cart.length === 0) {
    checkoutContainer.innerHTML = "<p>Your cart is empty</p>";
    totalDisplay.textContent = "DZD 0";
    subTotalDisplay.textContent = "DZD 0";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "product-summary";

    div.innerHTML = `
      <img src="${item.image}" alt="Product image" />
      <div>
        <p>${item.name} (${item.color})</p>
        <span>DZD ${(item.price * item.quantity).toLocaleString("en-US")}</span>
        <p>Qty: ${item.quantity}</p>
      </div>
    `;

    checkoutContainer.appendChild(div);
  });

  subTotalDisplay.textContent = "DZD " + total.toLocaleString("en-US");

  const shippingText = checkoutData.deliveryOption;

  let shippingFee = 0;
  if (shippingText.includes("600")) shippingFee = 600;
  if (shippingText.includes("900")) shippingFee = 900;

  shippingFeeDisplay.textContent =
    shippingFee === 0 ? "FREE" : "DZD " + shippingFee;

  totalDisplay.textContent =
    "DZD " + (total + shippingFee).toLocaleString("en-US");
}

document.addEventListener("DOMContentLoaded", () => {
  displayOrder();
});

fetch("../../data/user.json")
  .then((res) => res.json())
  .then((users) => {
    if (!checkoutData) return;

    const user = users.find((u) => u.id === checkoutData.clientId);

    if (user) {
      document.getElementById("conf-name").textContent =
        user.firstName + " " + user.lastName;
    } else {
      console.log("User not found");
    }
  });

document.getElementById("conf-email").textContent = checkoutData.email;
document.getElementById("conf-address").textContent = checkoutData.address;
document.getElementById("conf-city").textContent = checkoutData.city;
document.getElementById("conf-state").textContent = checkoutData.state;
document.getElementById("conf-postal-code").textContent =
  checkoutData.postalCode;
document.getElementById("conf-delivery-options").textContent =
  checkoutData.deliveryOption;
document.getElementById("conf-payment-methods").textContent =
  checkoutData.paymentMethod || "Pay on delivery";

confirmBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});
goHomeBtn.addEventListener("click", () => {
  localStorage.removeItem("cart");
  localStorage.removeItem("checkoutData");

  window.location.href = "client.html";
});
