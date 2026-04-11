const checkoutContainer = document.querySelector(".checkout-cart");
const totalDisplay = document.querySelector(".order-total h4 span:last-child");
const subTotalDisplay = document.querySelector(".sub-total span:last-child");
const shippingFeeDisplay = document.querySelector(
  ".shipping-fee span:last-child",
);

const cardForm = document.getElementById("cardForm");
const form = document.querySelector(".checkout-form");

let subtotal = 0;
let shippingFee = 0;

function displayCheckout() {
  const cart = getCart();
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
      <img src="${item.image}" alt="Product image"/>
      <div>
        <p>${item.name} (${item.color})</p>
        <span>DZD ${(item.price * item.quantity).toLocaleString("en-US")}</span>
        <p>Qty: ${item.quantity}</p>
      </div>
    `;
    checkoutContainer.appendChild(div);
  });

  subtotal = total;
  updateTotal();
}

function updateTotal() {
  subTotalDisplay.textContent = "DZD " + subtotal.toLocaleString("en-US");
  const finalTotal = subtotal + shippingFee;
  totalDisplay.textContent = "DZD " + finalTotal.toLocaleString("en-US");
}

document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();

  if (!user) {
    localStorage.setItem("redirectAfterLogin", window.location.href);
    window.location.href = "sign_in.html";
    return;
  }

  const form = document.querySelector(".checkout-form");

  if (!form) return;

  displayCheckout();

  const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
  deliveryOptions.forEach((option) => {
    option.addEventListener("change", () => {
      shippingFee = parseInt(option.value);
      shippingFeeDisplay.textContent =
        shippingFee === 0 ? "FREE" : "DZD " + shippingFee;
      updateTotal();
    });
  });

  const paymentOptions = document.querySelectorAll('input[name="payment"]');
  const cardInputs = cardForm.querySelectorAll("input");

  const selectedPayment = document.querySelector(
    'input[name="payment"]:checked',
  );
  if (selectedPayment && selectedPayment.id === "online-payment") {
    cardForm.classList.add("active");
    cardInputs.forEach((input) => (input.required = true));
  }

  paymentOptions.forEach((option) => {
    option.addEventListener("change", () => {
      if (option.id === "online-payment" && option.checked) {
        cardForm.classList.add("active");
        cardInputs.forEach((input) => (input.required = true));
      } else {
        cardForm.classList.remove("active");
        cardInputs.forEach((input) => (input.required = false));
      }
    });
  });

  const cardNumberInput = cardForm.querySelector(
    'input[placeholder="Card Number"]',
  );
  cardNumberInput?.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    e.target.value = value.match(/.{1,4}/g)?.join(" ") || value;

    if (value.length < 13 || value.length > 19) {
      cardNumberInput.setCustomValidity("Card number must be 13-19 digits");
    } else {
      cardNumberInput.setCustomValidity("");
    }
  });

  const expiryInput = cardForm.querySelector('input[placeholder="MM/YY"]');
  expiryInput?.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2)
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    e.target.value = value;

    const [month, year] = e.target.value.split("/").map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (
      !month ||
      !year ||
      month < 1 ||
      month > 12 ||
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      expiryInput.setCustomValidity("Enter a valid future expiry date");
    } else {
      expiryInput.setCustomValidity("");
    }
  });

  const cvvInput = cardForm.querySelector('input[placeholder="CVV"]');
  cvvInput?.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
    if (e.target.value.length < 3 || e.target.value.length > 4) {
      cvvInput.setCustomValidity("CVV must be 3 or 4 digits");
    } else {
      cvvInput.setCustomValidity("");
    }
  });

  const emailInput = form.querySelector('input[type="email"]');
  emailInput?.addEventListener("input", () => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(emailInput.value)) {
      emailInput.setCustomValidity("Please enter a valid email address");
    } else {
      emailInput.setCustomValidity("");
    }
  });
  function saveOrder() {
    const user = JSON.parse(localStorage.getItem("user"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      orderId: "#" + Date.now(),
      email: user.email,
      date: new Date().toLocaleDateString(),
      status: "Pending",
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),

      address: document.querySelector('input[placeholder="Enter full address"]')
        .value,
      city: document.querySelector('input[placeholder="City"]').value,
      state: document.querySelector('input[placeholder="State"]').value,
      postalCode: document.querySelector('input[placeholder="Postal Code"]')
        .value,
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const selectedDelivery = document.querySelector(
      'input[name="delivery"]:checked',
    );

    const selectedPayment = document.querySelector(
      'input[name="payment"]:checked',
    );

    const checkoutData = {
      email: form.querySelector('input[type="email"]').value,
      address: document.querySelector('input[placeholder="Enter full address"]')
        .value,
      city: document.querySelector('input[placeholder="City"]').value,
      state: document.querySelector('input[placeholder="State"]').value,
      postalCode: document.querySelector('input[placeholder="Postal Code"]')
        .value,

      deliveryOption: selectedDelivery
        ? selectedDelivery.nextElementSibling.textContent
        : "Standard",

      paymentMethod: selectedPayment
        ? selectedPayment.nextElementSibling.textContent
        : "Pay on delivery",

      cart: getCart(),
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    saveOrder();

    window.location.href = "confirmation.html";
  });
});
