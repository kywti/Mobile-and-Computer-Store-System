const productTableBody = document.getElementById("product-table-body");
const totalProductsEl = document.getElementById("total-products");
const lowStockEl = document.getElementById("low-stock");
const outStockEl = document.getElementById("out-stock");

const searchInput = document.querySelector(".search");
const filterButtons = document.querySelectorAll(".filters button");
const addProductBtn = document.querySelector(".add-product-btn");

let allProducts = [];
let currentFilter = "All Products";
let editingProductId = null;
let deletingProductId = null;
let newProductImage = "";
let editedProductImage = "";

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadProducts();
  setupEventListeners();
}

function loadProducts() {
  fetch("../../data/product.json")
    .then((res) => res.json())
    .then((products) => {
      allProducts = products.map(flattenProductData);
      updateStats();
      renderTable(allProducts);
    })
    .catch(() => {
      productTableBody.innerHTML =
        '<tr><td colspan="8">Error loading products</td></tr>';
    });
}

function flattenProductData(product) {
  let stock = 0;
  let image = "";

  if (product.variants?.length) {
    const v = product.variants[0];
    stock = v.stock ?? product.stock ?? 0;
    image = v.images?.[0] || "";
  } else {
    stock = product.stock ?? 0;
  }

  return {
    id: product.id,
    name: product.name,
    category: capitalize(product.category),
    stock,
    price: product.price,
    supplier: product.manufacturer || "N/A",
    image,
  };
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}

function getStatus(stock) {
  if (stock === 0) return "Out of Stock";
  if (stock < 60) return "Low Stock";
  return "In Stock";
}

function getStatusClass(status) {
  return {
    "Out of Stock": "out-of-stock",
    "Low Stock": "low-stock",
    "In Stock": "in-stock",
  }[status];
}

function updateStats() {
  totalProductsEl.textContent = allProducts.length;
  lowStockEl.textContent = allProducts.filter(
    (p) => p.stock > 0 && p.stock < 60,
  ).length;
  outStockEl.textContent = allProducts.filter((p) => p.stock === 0).length;
}

function renderTable(products) {
  productTableBody.innerHTML = "";

  if (!products.length) {
    productTableBody.innerHTML =
      '<tr><td colspan="8">No products found</td></tr>';
    return;
  }

  products.forEach((product) => {
    const status = getStatus(product.stock);
    const statusClass = getStatusClass(status);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img class="inventory-product-img" src="${product.image}" alt="Product image" onerror="this.src='../../img/icons/no-image.png'"></td>
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
  const f = filter.toLowerCase();

  if (f === "in stock") return products.filter((p) => p.stock > 0);
  if (f === "low stock")
    return products.filter((p) => p.stock > 0 && p.stock < 60);
  if (f === "out of stock") return products.filter((p) => p.stock === 0);

  return products;
}

function applySearch(products) {
  const term = searchInput.value.toLowerCase().trim();
  if (!term) return products;

  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.supplier.toLowerCase().includes(term),
  );
}

function setupEventListeners() {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.textContent.trim();
      let filtered = filterProducts(allProducts, currentFilter);
      filtered = applySearch(filtered);
      renderTable(filtered);
    });
  });

  searchInput.addEventListener(
    "input",
    debounce(() => {
      let filtered = filterProducts(allProducts, currentFilter);
      filtered = applySearch(filtered);
      renderTable(filtered);
    }, 300),
  );

  if (addProductBtn) {
    addProductBtn.addEventListener("click", openAddModal);
  }
}

function attachTableEventListeners() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      const product = allProducts.find((p) => p.id === id);
      if (product) {
        editingProductId = id;
        openEditModal(product);
      }
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      const product = allProducts.find((p) => p.id === id);
      if (product) {
        deletingProductId = id;
        openDeleteModal(product);
      }
    });
  });

  document.querySelectorAll(".more-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns();
      const menu = this.nextElementSibling;
      menu.style.opacity = "1";
      menu.style.visibility = "visible";
      menu.style.transform = "translateY(0)";
    });
  });

  document.addEventListener("click", closeAllDropdowns);
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.style.opacity = "0";
    menu.style.visibility = "hidden";
    menu.style.transform = "translateY(-10px)";
  });
}

function openAddModal() {
  resetAddModal();
  document.getElementById("addProductModal").style.display = "flex";
}

function resetAddModal() {
  document.getElementById("productName").value = "";
  document.getElementById("productSupplier").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productQuantity").value = "";
  document.getElementById("productCategory").value = "";
  document.getElementById("imagePreview").innerHTML = `
    <div class="no-image-text">
      <div style="font-size: 18px; margin-bottom: 5px;">➕Add Product Image</div>
      <div style="font-size: 12px; color: #999;">Click "Load Image" below</div>
    </div>
  `;
  newProductImage = "";
}

function openEditModal(product) {
  editedProductImage = "";
  document.getElementById("editProductName").value = product.name;
  document.getElementById("editProductSupplier").value = product.supplier;
  document.getElementById("editProductPrice").value = product.price;
  document.getElementById("editProductQuantity").value = product.stock;
  document.getElementById("editProductCategory").value =
    product.category.toLowerCase();

  const editImagePreview = document.getElementById("editImagePreview");
  if (product.image && product.image !== "") {
    editImagePreview.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
    editImagePreview.classList.add("has-image");
  } else {
    editImagePreview.innerHTML = `
      <div class="no-image-text">
        <div style="font-size: 18px; margin-bottom: 5px;">➕ Update Product Image</div>
        <div style="font-size: 12px; color: #999;">Click "Load Image" below</div>
      </div>
    `;
    editImagePreview.classList.remove("has-image");
  }

  document.getElementById("editProductModal").style.display = "flex";
}

function openDeleteModal(product) {
  document.getElementById("deleteProductName").textContent = product.name;
  document.getElementById("deleteConfirmModal").style.display = "flex";
}

function setupImageUpload() {
  const addImageInput = document.getElementById("productImage");
  const addLoadBtn = document.querySelector("#addProductModal .load-image-btn");
  const addPreview = document.getElementById("imagePreview");

  addLoadBtn.addEventListener("click", () => addImageInput.click());
  addImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        newProductImage = e.target.result; 

        addPreview.innerHTML = `<img src="${newProductImage}" alt="Preview">`;
        addPreview.classList.add("has-image");
      };

      reader.readAsDataURL(file);
    }
  });

  const editImageInput = document.getElementById("editProductImage");
  const editLoadBtn = document.querySelector(
    "#editProductModal .load-image-btn",
  );
  const editPreview = document.getElementById("editImagePreview");

  editLoadBtn.addEventListener("click", () => editImageInput.click());
  editImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        editedProductImage = e.target.result;
        editPreview.innerHTML = `<img src="${editedProductImage}" alt="Preview">`;
        editPreview.classList.add("has-image");
      };

      reader.readAsDataURL(file);
    }
  });
}

function setupModalListeners() {
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("close-modal")) {
      const modal = e.target.closest(
        ".add-product-modal, .edit-product-modal, .delete-confirm-modal",
      );
      if (modal) modal.style.display = "none";
    }
  });

  document
    .getElementById("confirmDeleteProduct")
    ?.addEventListener("click", function () {
      if (deletingProductId !== null) {
        allProducts = allProducts.filter((p) => p.id !== deletingProductId);

        updateStats();

        let filtered = filterProducts(allProducts, currentFilter);
        filtered = applySearch(filtered);
        renderTable(filtered);
      }

      document.getElementById("deleteConfirmModal").style.display = "none";
      deletingProductId = null;
    });

  document
    .querySelector(".cancel-delete-btn")
    ?.addEventListener("click", function () {
      document.getElementById("deleteConfirmModal").style.display = "none";
      editingProductId = null;
    });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document
        .querySelectorAll(
          ".add-product-modal, .edit-product-modal, .delete-confirm-modal",
        )
        .forEach((modal) => {
          modal.style.display = "none";
        });
    }
  });

  document
    .querySelectorAll(
      ".add-product-modal, .edit-product-modal, .delete-confirm-modal",
    )
    .forEach((modal) => {
      modal.addEventListener("click", function (e) {
        if (e.target === this) {
          this.style.display = "none";
        }
      });
    });

  document
    .getElementById("confirmAddProduct")
    ?.addEventListener("click", function () {
      const name = document.getElementById("productName").value;
      const supplier = document.getElementById("productSupplier").value;
      const price = parseFloat(document.getElementById("productPrice").value);
      const quantity = parseInt(
        document.getElementById("productQuantity").value,
      );
      const category = document.getElementById("productCategory").value;

      if (!name || !price || !category) {
        alert("Please fill required fields");
        return;
      }

      const newProduct = {
        id: Date.now(),
        name,
        supplier,
        price,
        stock: quantity || 0,
        category,
        image: newProductImage || "",
      };

      allProducts.push(newProduct);

      updateStats();

      let filtered = filterProducts(allProducts, currentFilter);
      filtered = applySearch(filtered);
      renderTable(filtered);

      document.getElementById("addProductModal").style.display = "none";
    });

  document
    .getElementById("confirmEditProduct")
    ?.addEventListener("click", function () {
      const name = document.getElementById("editProductName").value;
      const supplier = document.getElementById("editProductSupplier").value;
      const price = parseFloat(
        document.getElementById("editProductPrice").value,
      );
      const quantity = parseInt(
        document.getElementById("editProductQuantity").value,
      );
      const category = document.getElementById("editProductCategory").value;

      if (!name || !price || !category) {
        alert("Please fill required fields");
        return;
      }

      const product = allProducts.find((p) => p.id === editingProductId);

      if (product) {
        product.name = name;
        product.supplier = supplier;
        product.price = price;
        product.stock = quantity || 0;
        product.category = capitalize(category);

        if (editedProductImage) {
          product.image = editedProductImage;
        }
      }

      updateStats();

      let filtered = filterProducts(allProducts, currentFilter);
      filtered = applySearch(filtered);
      renderTable(filtered);

      document.getElementById("editProductModal").style.display = "none";

      editingProductId = null;
      editedProductImage = "";
    });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

setupModalListeners();
setupImageUpload();
