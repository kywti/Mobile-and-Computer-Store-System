const container = document.getElementById("checkout-items");
const totalDisplay = document.querySelector(".order-total h4 span:last-child");

document.addEventListener("DOMContentLoaded", () => {
  displayCheckout();
});

function displayCheckout() {
  const cart = getCart();

  console.log(cart); // DEBUG

  const container = document.getElementById("checkout-items");
  const totalDisplay = document.querySelector(".order-total h4 span:last-child");

  container.innerHTML = "";

  if (!cart || cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty</p>";
    totalDisplay.textContent = "DZD 0";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");

    div.innerHTML = `
      <img src="${item.image}" />
      <div>
        <p>${item.name} (${item.color})</p>
        <span>DZD ${(item.price * item.quantity).toLocaleString("en-US")}</span>
        <p>Qty: ${item.quantity}</p>
      </div>
    `;

    container.appendChild(div);
  });

  totalDisplay.textContent = "DZD " + total.toLocaleString("en-US");
}


document.addEventListener('DOMContentLoaded', function() {
  const onlinePaymentRadio = document.getElementById('online-payment');
  const cardForm = document.getElementById('cardForm');
  
  // Toggle card form
  onlinePaymentRadio.addEventListener('change', function() {
    if (this.checked) {
      cardForm.classList.add('active');
    } else {
      cardForm.classList.remove('active');
    }
  });
  
  // Card number formatting
  const cardNumberInput = cardForm.querySelector('input[placeholder="Card Number"]');
  cardNumberInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
  });
  
  // Expiry date formatting
  const expiryInput = cardForm.querySelector('input[placeholder="MM/YY"]');
  expiryInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
  });
  
  // CVV formatting
  const cvvInput = cardForm.querySelector('input[placeholder="CVV"]');
  cvvInput.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
  });
  
  // Place order
const placeOrderBtn = document.querySelector('.add-to-cart-button-checkout-pg');
  placeOrderBtn.addEventListener('click', function() {
    alert('Order placed successfully! 🎉');
  });
});

