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
const searchQuery = params.get("search");

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

if (grid) {
  fetch("../../data/product.json")
    .then((res) => res.json())
    .then((products) => {
      let filteredProducts = products;

      const category = params.get("category");
      const search = params.get("search");
      const minPrice = params.get("minPrice");
      const maxPrice = params.get("maxPrice");
      const manufacturer = params.get("manufacturer");

      // CATEGORY
      if (category) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase(),
        );
      }

      // SEARCH
      if (search) {
        const q = search.toLowerCase();

        filteredProducts = filteredProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.manufacturer && p.manufacturer.toLowerCase().includes(q)),
        );
      }

      // MANUFACTURER
      if (manufacturer) {
        filteredProducts = filteredProducts.filter(
          (p) => p.manufacturer?.toLowerCase() === manufacturer.toLowerCase(),
        );
      }

      // MIN PRICE
      if (minPrice) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price >= Number(minPrice),
        );
      }

      if (maxPrice) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price <= Number(maxPrice),
        );
      }

      if (filteredProducts.length === 0) {
        grid.innerHTML = "<p>No products found.</p>";
        return;
      }

      const shuffled = shuffleArray(filteredProducts);
      displayProducts(shuffled);
    })
    .catch((err) => console.error(err));
}

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

/*
function filterProducts(products) {
  if (!searchQuery) return products;

  return products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
}
*/
const brandFilter = document.getElementById("brandFilter");
if (brandFilter) {
  brandFilter.addEventListener("change", () => {
    const manufacturer = brandFilter.value;

    const url = new URL(window.location.href);

    if (manufacturer) url.searchParams.set("manufacturer", manufacturer);
    else url.searchParams.delete("manufacturer");

    window.location.href = url;
  });
}

const priceFilter = document.getElementById("priceFilter");

if (priceFilter) {
  priceFilter.addEventListener("change", () => {
    const value = priceFilter.value;

    const url = new URL(window.location.href);

    // remove old params first
    url.searchParams.delete("minPrice");
    url.searchParams.delete("maxPrice");

    if (value === "0-5000") {
      url.searchParams.set("minPrice", 0);
      url.searchParams.set("maxPrice", 5000);
    } else if (value === "5000-20000") {
      url.searchParams.set("minPrice", 5000);
      url.searchParams.set("maxPrice", 20000);
    } else if (value === "20000-50000") {
      url.searchParams.set("minPrice", 20000);
      url.searchParams.set("maxPrice", 50000);
    } else if (value === "50000+") {
      url.searchParams.set("minPrice", 50000);
    }

    window.location.href = url;
  });
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
const filterInput = document.getElementById("filterInput");
const filterBtn = document.getElementById("filterBtn");

function applyFilter() {
  const value = filterInput.value.trim();

  if (!value) return;

  window.location.href = `products.html?search=${encodeURIComponent(value)}`;
}

if (filterBtn) {
  filterBtn.addEventListener("click", applyFilter);
}

if (filterInput) {
  filterInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      applyFilter();
    }
  });
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
