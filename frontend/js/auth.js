function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function login(email, password) {
  const users = getUsers();

  // 1. HARD-CODED ADMIN FIRST
  if (email === "admin@shop.com" && password === "admin123") {
    const adminUser = {
      email: "admin@shop.com",
      role: "admin",
    };

    localStorage.setItem("user", JSON.stringify(adminUser));
    localStorage.removeItem("cart");

    window.location.href = "/frontend/admin/dashboard.html";
    return;
  }

  // 2. NORMAL USERS
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));

  const redirect = localStorage.getItem("redirectAfterLogin");

  if (redirect) {
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirect;
  } else {
    window.location.href = "/frontend/client/client.html";
  }
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
}

function handleLogin(username, role) {
  login({ username, role });

  if (role === "admin") {
    localStorage.removeItem("cart");
    window.location.href = "/frontend/admin/dashboard.html";
  } else {
    window.location.href = "/frontend/client/client.html";
  }
}

function signUp(userData) {
  const users = getUsers();

  const exists = users.find((u) => u.email === userData.email);
  if (exists) {
    alert("User already exists");
    return;
  }

  users.push(userData);
  saveUsers(users);

  alert("Account created!");

  window.location.href = "/frontend/client/sign_in.html";
}

const signupForm = document.querySelector("form");

if (signupForm && window.location.href.includes("sign_up.html")) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.querySelector('input[type="email"]').value;
    const password = document.getElementById("password").value;

    const user = {
      firstName,
      lastName,
      email,
      password,
      role: "client", // default role
    };

    signUp(user);
  });
}

const loginForm = document.querySelector("form");

if (loginForm && window.location.href.includes("sign_in.html")) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

function requireLogin(redirectTo) {
  const user = getCurrentUser();

  if (!user) {
    localStorage.setItem("redirectAfterLogin", redirectTo);
    window.location.href = "/frontend/client/sign_in.html";
    return false;
  }

  return true;
}
