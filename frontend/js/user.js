const tableBody = document.querySelector("tbody");
const totalUsersEl = document.getElementById("total-products");
const newUsersEl = document.getElementById("low-stock");
const blockedUsersEl = document.getElementById("out-stock");

const searchInput = document.querySelector(".search");
const filterButtons = document.querySelectorAll(".filters button");

let allUsers = [];
let currentFilter = "All Users";
let selectedUser = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadUsers();
  setupEventListeners();
  setupModalListeners();
}

function loadUsers() {
  fetch("../../data/user.json")
    .then(res => res.json())
    .then(users => {
      allUsers = users.map(u => ({
        ...u,
        status: "ACTIVE"
      }));
      updateStats();
      renderTable(allUsers);
    })
    .catch(() => {
      tableBody.innerHTML = `<tr><td colspan="6">Error loading users</td></tr>`;
    });
}

function updateStats() {
  totalUsersEl.textContent = allUsers.length;
  newUsersEl.textContent = allUsers.filter(u => u.totalOrders <= 2).length;
  blockedUsersEl.textContent = allUsers.filter(u => u.status === "BLOCKED").length;
}

function renderTable(users) {
  tableBody.innerHTML = "";

  if (!users.length) {
    tableBody.innerHTML = `<tr><td colspan="6">No users found</td></tr>`;
    return;
  }

  users.forEach((user, index) => {
    const avatar = user.role === "ADMIN"
      ? "../../img/icons/admin-pfp.jpg"
      : "../../img/icons/client-pfp.jpg";

    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img class="user-avatar" src="${avatar}"></td>
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.totalOrders}</td>
      <td class="actions">
        <button class="action-btn more-btn">
          <img src="../../img/icons/menu-dots.png">
        </button>

        <div class="dropdown-menu">
          <button class="dropdown-item edit" data-index="${index}">
            <img src="../../img/icons/edit.png"> Edit Role
          </button>

          <button class="dropdown-item block" data-index="${index}">
            <img src="../../img/icons/block.png"> Block User
          </button>

          <button class="dropdown-item delete" data-index="${index}">
            <img src="../../img/icons/delete.png"> Delete User
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });

  attachTableEvents();
}

function filterUsers(users, filter) {
  if (filter === "Admin Users") return users.filter(u => u.role === "ADMIN");
  if (filter === "Clients") return users.filter(u => u.role === "CLIENT");
  return users;
}

function applySearch(users) {
  const term = searchInput.value.toLowerCase();

  return users.filter(u =>
    (u.firstName + " " + u.lastName).toLowerCase().includes(term) ||
    u.email.toLowerCase().includes(term)
  );
}

function setupEventListeners() {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      filterButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      currentFilter = this.textContent;

      let filtered = filterUsers(allUsers, currentFilter);
      filtered = applySearch(filtered);

      renderTable(filtered);
    });
  });

  searchInput.addEventListener("input", debounce(() => {
    let filtered = filterUsers(allUsers, currentFilter);
    filtered = applySearch(filtered);
    renderTable(filtered);
  }, 300));
}

function attachTableEvents() {
  document.querySelectorAll(".more-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeDropdowns();
      const menu = this.nextElementSibling;
      menu.style.display = "block";
    });
  });

  document.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", function () {
      selectedUser = allUsers[this.dataset.index];
      document.getElementById("editUserName").textContent =
        selectedUser.firstName + " " + selectedUser.lastName;
      document.getElementById("editRoleModal").style.display = "flex";
    });
  });

  document.querySelectorAll(".block").forEach(btn => {
    btn.addEventListener("click", function () {
      selectedUser = allUsers[this.dataset.index];
      document.getElementById("blockUserName").textContent =
        selectedUser.firstName + " " + selectedUser.lastName;
      document.getElementById("blockConfirmModal").style.display = "flex";
    });
  });

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", function () {
      selectedUser = allUsers[this.dataset.index];
      document.getElementById("deleteUserName").textContent =
        selectedUser.firstName + " " + selectedUser.lastName;
      document.getElementById("deleteConfirmModal").style.display = "flex";
    });
  });

  document.addEventListener("click", closeDropdowns);
}

function closeDropdowns() {
  document.querySelectorAll(".dropdown-menu").forEach(menu => {
    menu.style.display = "none";
  });
}

function setupModalListeners() {
  document.querySelector(".cancel-block-btn").onclick = () =>
    document.getElementById("blockConfirmModal").style.display = "none";

  document.querySelector(".cancel-delete-btn").onclick = () =>
    document.getElementById("deleteConfirmModal").style.display = "none";

  document.querySelector(".cancel-edit-role-btn").onclick = () =>
    document.getElementById("editRoleModal").style.display = "none";

  document.getElementById("confirmBlockUser").onclick = () => {
    selectedUser.status = "BLOCKED";
    updateStats();
    renderTable(allUsers);
    document.getElementById("blockConfirmModal").style.display = "none";
  };

  document.getElementById("confirmDeleteUser").onclick = () => {
    allUsers = allUsers.filter(u => u !== selectedUser);
    updateStats();
    renderTable(allUsers);
    document.getElementById("deleteConfirmModal").style.display = "none";
  };

  document.getElementById("confirmEditRole").onclick = () => {
    const newRole = document.getElementById("newUserRole").value.toUpperCase();
    selectedUser.role = newRole;
    renderTable(allUsers);
    document.getElementById("editRoleModal").style.display = "none";
  };
}

function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}