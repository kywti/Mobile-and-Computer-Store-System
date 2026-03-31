const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
const colorVarsChoice = document.querySelector(".product-colors-button");
const colorVarsImg = document.querySelector(".variants-images");

//Button Event Listeners
const backButton = document.getElementById("pdp-back-button");
backButton.addEventListener("click", () => {
  window.location.href = "products.html";
});



fetch("/data/product.json")
  .then((res) => res.json())
  .then((products) => {
    const product = products.find((p) => p.id === productId);
    displayProduct(product);
  });

function displayProduct(product) {
  if (!product) return;

  document.getElementById("product-image").src = product.variants[0].images[0];

  document.getElementById("product-category").textContent =
    product.category || "Phone";

  document.getElementById("product-rating").textContent = product.rating;

  document.getElementById("product-name").textContent = product.name;

  document.getElementById("product-description").textContent =
    product.description;

  document.getElementById("product-price").textContent = "DZD " + product.price;

  const variantButtons = []; // store buttons

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

      variantButtons.forEach((btn) => btn.classList.remove("selected"));

      colorVarButton.classList.add("selected");

      radioInput.checked = true;
    });

    radioInput.addEventListener("change", () => {
      changeMainImage(variant.images[0]);

      variantButtons.forEach((btn) => btn.classList.remove("selected"));
      colorVarButton.classList.add("selected");
    });

    colorVarsImg.appendChild(colorVarButton);
  });
}

function changeMainImage(newSrc) {
  document.getElementById("product-image").src = newSrc;
}
