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
