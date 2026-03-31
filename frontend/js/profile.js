document.addEventListener('DOMContentLoaded', function() {
  loadUserData();
});

function goToOrderHistory() {
  window.location.href = 'order-history.html';
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'signin.html';
  }
}

// LOAD REAL USER DATA (no "no data")
function loadUserData() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      document.getElementById('firstName').textContent = user.firstName || 'John';
      document.getElementById('lastName').textContent = user.lastName || 'Doe';
      document.getElementById('email').textContent = user.email || 'john@email.com';
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}