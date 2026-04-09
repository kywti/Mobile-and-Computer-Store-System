const profileButton = document.querySelector(".profile-button");
if (profileButton) {
  profileButton.addEventListener("click", () => {
    window.location.href = "profile.html";
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
