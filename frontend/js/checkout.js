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
  const placeOrderBtn = document.querySelector('.add-to-cart-button');
  placeOrderBtn.addEventListener('click', function() {
    alert('Order placed successfully! 🎉');
  });
});