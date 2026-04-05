const profileButton = document.querySelector(".profile-button");
profileButton.addEventListener("click", () => {
  window.location.href = "profile.html";
});

const homeButton = document.querySelector(".home-header-button");
homeButton.addEventListener("click", () => {
  window.location.href = "client.html";
});

const seeMoreButton = document.querySelector(".see-more-button");
seeMoreButton.addEventListener("click", () => {
  window.location.href = "products.html";
});

const shoppingCartButton = document.querySelector(".shopping-cart-button");
shoppingCartButton.addEventListener("click", () => {
  window.location.href = "shopping-cart.html";
});

const phoneCategoryBtn = document.querySelector(".phone-category-button");
phoneCategoryBtn.addEventListener("click", () => {
  window.location.href = "products.html?category=phone";
});

const laptopCategoryBtn = document.querySelector(".laptop-category-button");
laptopCategoryBtn.addEventListener("click", () => {
  window.location.href = "products.html?category=laptop";
});

const accessoryCategoryBtn = document.querySelector(".accessory-category-button");
accessoryCategoryBtn.addEventListener("click", () => {
  window.location.href = "products.html?category=accessory";
});

const tabletCategoryBtn = document.querySelector(".tablet-category-button");
tabletCategoryBtn.addEventListener("click", () => {
  window.location.href = "products.html?category=tablet";
});





