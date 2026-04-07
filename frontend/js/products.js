const grid = document.querySelector(".products-grid");

const phonesBtn = document.querySelector(".phones-header-button");
if (phonesBtn) {
  phonesBtn.addEventListener("click", () => {
    window.location.href = "products.html?category=phone";
  });
}

const laptopsBtn = document.querySelector(".laptops-header-button");
if (laptopsBtn) {
  laptopsBtn.addEventListener("click", () => {
    window.location.href = "products.html?category=laptop";
  });
}

const tabletsBtn = document.querySelector(".tablets-header-button");
if (tabletsBtn) {
  tabletsBtn.addEventListener("click", () => {
    window.location.href = "products.html?category=tablet";
  });
}

const accessoriesBtn = document.querySelector(".accessories-header-button");
if (accessoriesBtn) {
  accessoriesBtn.addEventListener("click", () => {
    window.location.href = "products.html?category=accessory";
  });
}

const params = new URLSearchParams(window.location.search);
const categoryFilter = params.get("category");

const ads = [
  "../../img/ads/ad-10.jpg",
  "../../img/ads/ad-11.jpg",
  "../../img/ads/ad-12.webp",
  "../../img/ads/ad-13.webp",
  "../../img/ads/ad-14.jpg",
  "../../img/ads/ad-9.jpg",
  "../../img/ads/ad-8.webp",
  "../../img/ads/ad-7.webp",
  "../../img/ads/ad-6.webp",
  "../../img/ads/ad-5.webp",
  "../../img/ads/ad-4.jpg",
  "../../img/ads/ad-3.jpg",
  "../../img/ads/ad-2.jpg",
  "../../img/ads/ad-1.jpg",
];

let adIndex = 0;

fetch("../../data/product.json")
  .then((res) => res.json())
  .then((products) => {
    let filteredProducts = products;

    if (categoryFilter) {
      filteredProducts = products.filter(
        (p) => p.category.toLowerCase() === categoryFilter.toLowerCase(),
      );
    }

    if (filteredProducts.length === 0) {
      grid.innerHTML = "<p>No products found.</p>";
      return;
    }

    const shuffled = shuffleArray(filteredProducts);
    
    displayProducts(shuffled);
  });

function displayProducts(products) {
  products.forEach((product, index) => {
    grid.appendChild(createProduct(product));

    if ((index + 1) % 6 === 0) {
      grid.appendChild(createAd());
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createProduct(product) {
  const div = document.createElement("div");
  div.className = "product";

  div.innerHTML = `
    <a href="product-details.html?id=${product.id}" class="product-link">
      <div class="product-picture">
        <img src="${product.variants[0].images[0]}" />
      </div>
    </a>

    <div class="product-details">
      <p class="product-category">${product.category || "Phone"}</p>

      <a href="product-details.html?id=${product.id}" class="product-link">
        <div class="product-info">
          <p class="product-name">${product.name}</p>
          <p class="product-rating">${product.rating}</p>
        </div>
      </a>

      <div class="product-buying-info">
        <p class="product-price">DZD ${product.price.toLocaleString("en-US")}</p>
        <div class="product-buying-buttons">
        <a href="product-details.html?id=${product.id}" class="product-link">
          <p class="product-details-link">see product</p>
        </a>
          <button class="add-to-basket-button">
            <img src="../../img/icons/shopping-basket-white.png" />
          </button>
        </div>
      </div>
    </div>
  `;

  const button = div.querySelector(".add-to-basket-button");

  button.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${product.id}`;
  });

  return div;
}

function createAd() {
  const div = document.createElement("div");
  div.className = "product-ad";

  const currentAd = ads[adIndex];

  div.innerHTML = `<img src="${currentAd}" />`;

  adIndex++;

  if (adIndex >= ads.length) {
    adIndex = 0;
  }

  return div;
}
