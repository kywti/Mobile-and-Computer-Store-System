const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
const colorVarsChoice = document.querySelector(".product-colors-button");
const colorVarsImg = document.querySelector(".variants-images");

//Button Event Listeners
const backButton = document.getElementById("pdp-back-button");
backButton.addEventListener("click", () => {
  window.location.href = "products.html";
});

fetch("../../data/product.json")
  .then((res) => res.json())
  .then((products) => {
    const product = products.find((p) => p.id === productId);
    displayProduct(product);
  });

let quantity = 1;

const quantityDisplay = document.querySelector(".quantity-display");
const plusBtn = document.querySelector(".pdp-plus");
const minusBtn = document.querySelector(".pdp-minus");

plusBtn.addEventListener("click", () => {
  quantity++;
  quantityDisplay.textContent = quantity;
});

minusBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityDisplay.textContent = quantity;
  }
});

let selectedColor = null;
let selectedImage = null;

function displayProduct(product) {
  if (!product) return;

  document.getElementById("product-image").src = product.variants[0].images[0];

  document.getElementById("product-category").textContent =
    product.category || "Phone";

  document.getElementById("product-rating").textContent = product.rating;

  document.getElementById("product-name").textContent = product.name;

  document.getElementById("product-description").textContent =
    product.description;

  document.getElementById("product-price").textContent =
    "DZD " + product.price.toLocaleString("en-US");

  const variantButtons = [];

  product.variants.forEach((variant) => {
    const colorVarLabel = document.createElement("label");
    colorVarLabel.className = "color-button";

    colorVarLabel.innerHTML = `
    <input type="radio" name="color" value="${variant.color}" />
    ${variant.color}
  `;

    const radioInput = colorVarLabel.querySelector("input");

    colorVarsChoice.append(colorVarLabel);

    const colorVarButton = document.createElement("button");
    colorVarButton.className = "variant-button";

    colorVarButton.innerHTML = `
    <img class="variant-picture" src="${variant.images[0]}" />
  `;

    variantButtons.push(colorVarButton); // store it

    colorVarButton.addEventListener("click", () => {
      changeMainImage(variant.images[0]);

      selectedColor = variant.color;
      selectedImage = variant.images[0];

      variantButtons.forEach((btn) => btn.classList.remove("selected"));
      colorVarButton.classList.add("selected");

      radioInput.checked = true;
    });

    radioInput.addEventListener("change", () => {
      changeMainImage(variant.images[0]);

      selectedColor = variant.color;
      selectedImage = variant.images[0];

      variantButtons.forEach((btn) => btn.classList.remove("selected"));
      colorVarButton.classList.add("selected");
    });

    colorVarsImg.appendChild(colorVarButton);
  });

  selectedColor = product.variants[0].color;
  selectedImage = product.variants[0].images[0];

  const button = document.querySelector(".add-to-cart-button");

  button.addEventListener("click", () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      color: selectedColor,
      quantity: quantity,
    });
  });
}

function changeMainImage(newSrc) {
  document.getElementById("product-image").src = newSrc;
}
