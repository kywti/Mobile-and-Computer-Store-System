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

const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.addEventListener("click", () => {
  window.location.href = "checkout.html";
});
