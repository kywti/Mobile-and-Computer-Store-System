const container = document.querySelector(".basket");
const total = document.querySelector(".total-price");

function displayCart() {
  const cart = getCart();

  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "basket-item";

    div.innerHTML = `<div >
                <img class="sc-product-image" src="${item.image}" />
              </div>
              <div class="item-layout">
                <div class="sc-item-details">
                  <p class="sc-product-name">${item.name}</p>
                  <p class="sc-product-price"> DZD ${item.price.toLocaleString("en-US")}</p>
                </div>
                <div class="sc-bottom-buttons">
                  <p>Quantity</p>
                  <div class="quantity-buttons">
                    <button class="sc-edit-quantity minus">-</button>
                    <p>${item.quantity}</p>
                    <button class="sc-edit-quantity plus">+</button>
                  </div>
                  <div class="sc-separator"></div>
                  <button class="delete-button">
                    <img class="icon" src="../../img/icons/delete.png" />
                  </button>
                </div>
              </div>`;

    div.querySelector(".plus").addEventListener("click", () => {
      updateQuantity(item.id, item.color, 1);
      displayCart();
    });

    div.querySelector(".minus").addEventListener("click", () => {
      if (item.quantity > 1) {
        updateQuantity(item.id, item.color, -1);
      } else {
        removeFromCart(item.id, item.color);
      }

      displayCart();
    });

    div.querySelector(".delete-button").addEventListener("click", () => {
      removeFromCart(item.id, item.color);
      displayCart();
    });

    container.appendChild(div);
  });

  total.textContent = "DZD " + getTotalPrice().toLocaleString("en-US");
}

displayCart();
