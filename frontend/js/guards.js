function requireLogin(redirectTo) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    localStorage.setItem("redirectAfterLogin", redirectTo);
    window.location.href = "/auth/sign_in.html";
    return false;
  }

  return true;
}

function requireAdmin() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    window.location.href = "client.html";
  }
}
