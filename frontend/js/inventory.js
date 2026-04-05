document.addEventListener("DOMContentLoaded", () => {
  // For user management - change table body selector if needed
  const tableBody = document.querySelector('tbody'); // Targets user table body
  
  // GLOBAL USERS ARRAY
  let allUsers = [];

  // LOAD USERS (replace with your user data endpoint)
  fetch("../../data/users.json") // Change to your users data file
    .then((res) => res.json())
    .then((users) => {
      allUsers = users; // STORE GLOBALLY
      displayUsers(users);
      updateStats(users);
    })
    .catch((err) => console.error("Error loading users:", err));

  function displayUsers(users) {
    let rows = "";
    
    users.forEach((user, index) => {
      rows += `
        <tr>
          <td><img class="user-avatar" src="${user.avatar || '../../img/icons/client-pfp.jpg'}" alt="User avatar" /></td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${user.orders || 0}</td>
          <td class="actions">
            <button class="action-btn" data-user-index="${index}">
              <img src="../../img/icons/menu-dots.png" />
            </button>
            <div class="dropdown-menu">
              <button class="dropdown-item edit" data-user-index="${index}">
                <img src="../../img/icons/edit.png" />
                Edit Role
              </button>
              <button class="dropdown-item block" data-user-index="${index}">
                <img src="../../img/icons/block.png" />
                Block User
              </button>
              <button class="dropdown-item delete" data-user-index="${index}">
                <img src="../../img/icons/delete.png" />
                Delete User
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows;

    // ADD EVENT LISTENERS AFTER TABLE RENDER
    document.querySelectorAll('.dropdown-item.edit').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.userIndex);
        openEditRoleModal(allUsers[index]);
      });
    });

    document.querySelectorAll('.dropdown-item.block').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.userIndex);
        openBlockConfirm(allUsers[index]);
      });
    });

    document.querySelectorAll('.dropdown-item.delete').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.userIndex);
        openDeleteConfirm(allUsers[index]);
      });
    });
  }

  function updateStats(users) {
    const total = users.length;
    const blocked = users.filter(u => u.status === 'blocked').length;
    const newUsers = users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length;

    document.getElementById("total-products").textContent = total;
    document.getElementById("low-stock").textContent = newUsers;
    document.getElementById("out-stock").textContent = blocked;
  }

  // ========== BLOCK USER MODAL ==========
  const blockModal = document.getElementById('blockConfirmModal');
  let userToBlock = null;

  function openBlockConfirm(user) {
    userToBlock = user;
    document.getElementById('blockUserName').textContent = user.name;
    blockModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBlockModal() {
    blockModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    userToBlock = null;
  }

  document.getElementById('confirmBlockUser').addEventListener('click', () => {
    if (userToBlock) {
      // Update user status
      const index = allUsers.findIndex(u => u === userToBlock);
      if (index > -1) {
        allUsers[index].status = 'blocked';
        displayUsers(allUsers);
        updateStats(allUsers);
        alert('⛔ User blocked successfully!');
      }
    }
    closeBlockModal();
  });

  // ========== DELETE USER MODAL ==========
  const deleteModal = document.getElementById('deleteConfirmModal');
  let userToDelete = null;

  function openDeleteConfirm(user) {
    userToDelete = user;
    document.getElementById('deleteUserName').textContent = user.name;
    deleteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDeleteModal() {
    deleteModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    userToDelete = null;
  }

  document.getElementById('confirmDeleteUser').addEventListener('click', () => {
    if (userToDelete) {
      const index = allUsers.findIndex(u => u === userToDelete);
      if (index > -1) {
        allUsers.splice(index, 1);
        displayUsers(allUsers);
        updateStats(allUsers);
        alert('🗑️ User deleted successfully!');
      }
    }
    closeDeleteModal();
  });

  // ========== EDIT ROLE MODAL ==========
  const editRoleModal = document.getElementById('editRoleModal');
  let userToEdit = null;

  function openEditRoleModal(user) {
    userToEdit = user;
    document.getElementById('editUserName').textContent = user.name;
    document.getElementById('newUserRole').value = user.role || 'Client';
    editRoleModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeEditRoleModal() {
    editRoleModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    userToEdit = null;
  }

  document.getElementById('confirmEditRole').addEventListener('click', () => {
    if (userToEdit) {
      const index = allUsers.findIndex(u => u === userToEdit);
      if (index > -1) {
        allUsers[index].role = document.getElementById('newUserRole').value;
        displayUsers(allUsers);
        updateStats(allUsers);
        alert('✨ Role updated successfully!');
      }
    }
    closeEditRoleModal();
  });

  // ========== CANCEL BUTTONS ==========
  document.querySelector('.cancel-block-btn')?.addEventListener('click', closeBlockModal);
  document.querySelector('.cancel-delete-btn')?.addEventListener('click', closeDeleteModal);
  document.querySelector('.cancel-edit-role-btn')?.addEventListener('click', closeEditRoleModal);

  // ========== BACKDROP CLICKS ==========
  [blockModal, deleteModal, editRoleModal].forEach(modal => {
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal.id === 'blockConfirmModal') closeBlockModal();
        if (modal.id === 'deleteConfirmModal') closeDeleteModal();
        if (modal.id === 'editRoleModal') closeEditRoleModal();
      }
    });
  });

  // ========== ESC KEY ==========
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (blockModal?.classList.contains('active')) closeBlockModal();
      if (deleteModal?.classList.contains('active')) closeDeleteModal();
      if (editRoleModal?.classList.contains('active')) closeEditRoleModal();
    }
  });

  console.log('✅ User Management Modals Ready!');
});