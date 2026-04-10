const headerForm = document.querySelector(".header-search-bar");

if (headerForm) {
  headerForm.addEventListener("submit", (e) => {
    e.preventDefault(); // 🚨 STOP FORM RELOAD

    const input = document.getElementById("headerSearch");
    const query = input?.value.trim();

    if (!query) return;

    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
  });
}
const profileButton = document.querySelector(".profile-button");
if (profileButton) {
  profileButton.addEventListener("click", () => {
    const user = getCurrentUser();

    if (!user) {
      localStorage.setItem("redirectAfterLogin", "profile.html");
      window.location.href = "sign_in.html";
    } else {
      window.location.href = "profile.html";
    }
  });
}
const homeButton = document.querySelector(".home-header-button");
if (homeButton) {
  homeButton.addEventListener("click", () => {
    window.location.href = "client.html";
  });
}

const seeMoreButton = document.querySelector(".see-more-button");
if (seeMoreButton) {
  seeMoreButton.addEventListener("click", () => {
    window.location.href = "products.html";
  });
}

const shoppingCartButton = document.querySelector(".shopping-cart-button");
if (shoppingCartButton) {
  shoppingCartButton.addEventListener("click", () => {
    window.location.href = "shopping-cart.html";
  });
}

const phoneCategoryBtn = document.querySelector(".phone-category-button");
if (phoneCategoryBtn) {
  phoneCategoryBtn.addEventListener("click", () => {
    window.location.href = "products.html?category=phone";
  });
}

const laptopCategoryBtn = document.querySelector(".laptop-category-button");
if (laptopCategoryBtn) {
  laptopCategoryBtn.addEventListener("click", () => {
    window.location.href = "products.html?category=laptop";
  });
}

const accessoryCategoryBtn = document.querySelector(
  ".accessory-category-button",
);
if (accessoryCategoryBtn) {
  accessoryCategoryBtn.addEventListener("click", () => {
    window.location.href = "products.html?category=accessory";
  });
}

const tabletCategoryBtn = document.querySelector(".tablet-category-button");
if (tabletCategoryBtn) {
  tabletCategoryBtn.addEventListener("click", () => {
    window.location.href = "products.html?category=tablet";
  });
}
