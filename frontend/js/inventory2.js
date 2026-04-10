const productTableBody = document.getElementById('product-table-body');
const totalProductsEl = document.getElementById('total-products');
const lowStockEl = document.getElementById('low-stock');
const outStockEl = document.getElementById('out-stock');

const searchInput = document.querySelector('.search');
const filterButtons = document.querySelectorAll('.filters button');
const addProductBtn = document.querySelector('.add-product-btn');

let allProducts = [];
let currentFilter = 'All Products';

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadProducts();
  setupEventListeners();
  setupModalListeners(); // ✅ FIXED: Modal listeners
}

function loadProducts() {
  fetch("../../data/product.json")
    .then(res => res.json())
    .then(products => {
      allProducts = products.map(flattenProductData);
      updateStats();
      renderTable(allProducts);
    })
    .catch(() => {
      productTableBody.innerHTML = '<tr><td colspan="8">Error loading products</td></tr>';
    });
}

function flattenProductData(product) {
  let stock ;
  let image = '';

  if (product.variants?.length) {
    const v = product.variants[0];
    stock = v.stock ?? product.stock ?? 0;
    image = v.images?.[0] || '';
  } else {
    stock = product.stock ?? 0;
  }

  return {
    id: product.id,
    name: product.name,
    category: capitalize(product.category),
    stock,
    price: product.price,
    supplier: product.manufacturer || 'N/A',
    image
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatus(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock < 60) return 'Low Stock';
  return 'In Stock';
}

function getStatusClass(status) {
  return {
    'Out of Stock': 'out-of-stock',
    'Low Stock': 'low-stock',
    'In Stock': 'in-stock'
  }[status];
}

function updateStats() {
  totalProductsEl.textContent = allProducts.length;
  lowStockEl.textContent = allProducts.filter(p => p.stock > 0 && p.stock < 60).length;
  outStockEl.textContent = allProducts.filter(p => p.stock === 0).length;
}

function renderTable(products) {
  productTableBody.innerHTML = '';

  if (!products.length) {
    productTableBody.innerHTML = '<tr><td colspan="8">No products found</td></tr>';
    return;
  }

  products.forEach(product => {
    const status = getStatus(product.stock);
    const statusClass = getStatusClass(status);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img class="inventory-product-img" src="${product.image}" onerror="this.src='../../img/icons/no-image.png'"></td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.stock}</td>
      <td><span class="status ${statusClass}">${status}</span></td>
      <td>$${product.price.toLocaleString()}</td>
      <td>${product.supplier}</td>
      <td>
        <div class="actions">
          <button class="action-btn more-btn">
            <img src="../../img/icons/menu-dots.png" alt="More">
          </button>
          <div class="dropdown-menu">
            <button class="dropdown-item edit-btn" data-id="${product.id}">
              <img src="../../img/icons/edit.png" alt="Edit"> Edit Product
            </button>
            <button class="dropdown-item delete-btn" data-id="${product.id}">
              <img src="../../img/icons/delete.png" alt="Delete"> Delete Product
            </button>
          </div>
        </div>
      </td>
    `;
    productTableBody.appendChild(row);
  });

  attachTableEventListeners();
}

function filterProducts(products, filter) {
  if (filter === 'In Stock') return products.filter(p => p.stock > 0);
  if (filter === 'Low Stock') return products.filter(p => p.stock > 0 && p.stock < 60);
  if (filter === 'Out of Stock') return products.filter(p => p.stock === 0);
  return products;
}

function applySearch(products) {
  const term = searchInput.value.toLowerCase().trim();
  if (!term) return products;

  return products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.category.toLowerCase().includes(term) ||
    p.supplier.toLowerCase().includes(term)
  );
}

// ============================================================================
// ✅ FIXED: MODAL FUNCTIONS WITH IMAGE SUPPORT
// ============================================================================
function openAddModal() {
  document.getElementById('addProductModal').style.display = 'flex';
}

function openEditModal(product) {
  // Fill all form fields
  document.getElementById('editProductName').value = product.name;
  document.getElementById('editProductSupplier').value = product.supplier;
  document.getElementById('editProductPrice').value = product.price;
  document.getElementById('editProductQuantity').value = product.stock;
  document.getElementById('editProductCategory').value = product.category.toLowerCase();
  
  // ✅ FIXED: Show product image in preview
  const editImagePreview = document.getElementById('editImagePreview');
  if (product.image && product.image !== '') {
    editImagePreview.innerHTML = `<img src="${product.image}" onerror="this.src='../../img/icons/no-image.png'" alt="${product.name}">`;
    editImagePreview.classList.add('has-image');
  } else {
    editImagePreview.innerHTML = `
      <div class="no-image-text">
        <div>No Image</div>
        <div>Click to upload</div>
      </div>
    `;
    editImagePreview.classList.remove('has-image');
  }
  
  document.getElementById('editProductModal').style.display = 'flex';
}

function openDeleteModal(product) {
  document.getElementById('deleteProductName').textContent = product.name;
  document.getElementById('deleteConfirmModal').style.display = 'flex';
}

// ============================================================================
// ✅ FIXED: ALL EVENT LISTENERS
// ============================================================================
function setupEventListeners() {
  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.textContent;
      let filtered = filterProducts(allProducts, currentFilter);
      filtered = applySearch(filtered);
      renderTable(filtered);
    });
  });

  // Search input
  searchInput.addEventListener('input', debounce(() => {
    let filtered = filterProducts(allProducts, currentFilter);
    filtered = applySearch(filtered);
    renderTable(filtered);
  }, 300));

  // Add product button
  if (addProductBtn) {
    addProductBtn.addEventListener('click', openAddModal);
  }
}

function setupModalListeners() {
  // ✅ FIXED: Close buttons (X buttons)
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-modal')) {
      e.target.closest('.add-product-modal, .edit-product-modal, .delete-confirm-modal').style.display = 'none';
    }
      // ✅ CANCEL BUTTON - CLOSES MODAL
  document.querySelector('.cancel-delete-btn')?.addEventListener('click', function() {
    document.getElementById('deleteConfirmModal').style.display = 'none';
  });
    // ✅ CONFIRM BUTTON - CLOSES + DELETE LOGIC
  document.querySelector('.confirm-delete-btn')?.addEventListener('click', function() {
    // Add your delete logic here
    console.log('Product deleted!');
    
    // Close modal
    document.getElementById('deleteConfirmModal').style.display = 'none';
    
    // Refresh table (example)
    renderTable(allProducts);
  });

  });

  // ✅ FIXED: ESC key closes modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.add-product-modal, .edit-product-modal, .delete-confirm-modal').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });

  // ✅ FIXED: Click outside closes modals
  document.querySelectorAll('.add-product-modal, .edit-product-modal, .delete-confirm-modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  });
}

function attachTableEventListeners() {
  // Edit buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      const product = allProducts.find(p => p.id === id);
      if (product) {
        openEditModal(product);
      }
    });
  });

  // Delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      const product = allProducts.find(p => p.id === id);
      if (product) {
        openDeleteModal(product);
      }
    });
  });

  // More button (dots menu)
  document.querySelectorAll('.more-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeAllDropdowns();
      const menu = this.nextElementSibling;
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.transform = 'translateY(0)';
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', closeAllDropdowns);
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transform = 'translateY(-10px)';
  });
}

function debounce(func, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => func(...args), wait);
  };
}
// ✅ ROBUST SEARCH INPUT FINDER
function getSearchInput() {
  return document.querySelector('.search') || 
         document.querySelector('input[placeholder*="search"]') ||
         document.querySelector('.search-container input') ||
         document.getElementById('productSearch');
}