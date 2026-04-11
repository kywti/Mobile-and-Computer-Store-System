requireLogin();

document.addEventListener("DOMContentLoaded", function () {
  loadUserData();
});

function goToOrderHistory() {
  window.location.href = "order-history.html";
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/Mobile-and-Computer-Store-System/frontend/client/client.html";
  }
}
function openModal(type) {
  document.getElementById(type + "Modal").style.display = "flex";
  if (type === "username") {
    const fullName =
      document.getElementById("firstName").textContent +
      " " +
      document.getElementById("lastName").textContent;
    document.getElementById("newUsername").value = fullName;
  } else if (type === "email") {
    document.getElementById("newEmail").value =
      document.getElementById("email").textContent;
  }
}

function closeModal(type) {
  document.getElementById(type + "Modal").style.display = "none";
}

function confirmUsernameChange() {
  const newUsername = document.getElementById("newUsername").value.trim();
  if (newUsername) {
    const names = newUsername.split(" ");
    document.getElementById("firstName").textContent = names[0] || "";
    document.getElementById("lastName").textContent =
      names.slice(1).join(" ") || "";
    closeModal("username");
  } else {
  }
}

function confirmEmailChange() {
  const newEmail = document.getElementById("newEmail").value.trim();
  if (newEmail && /\S+@\S+\.\S+/.test(newEmail)) {
    document.getElementById("email").textContent = newEmail;
    closeModal("email");
    alert("Email updated successfully!");
  } else {
    alert("Please enter a valid email address");
  }
}

function confirmPasswordChange() {
  const newPassword = document.getElementById("newPassword").value;
  if (newPassword.length >= 6) {
    document.querySelector("#password .info-value").textContent = "*".repeat(
      newPassword.length,
    );
    closeModal("password");
    alert("Password updated successfully!");
  } else {
    alert("Password must be at least 6 characters long");
  }
}

window.onclick = function (event) {
  if (event.target.classList.contains("modal-overlay")) {
    closeModal("username");
    closeModal("email");
    closeModal("password");
  }
};

function loadUserData() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      document.getElementById("firstName").textContent =
        user.firstName || "John";
      document.getElementById("lastName").textContent = user.lastName || "Doe";
      document.getElementById("email").textContent =
        user.email || "john@email.com";
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}
