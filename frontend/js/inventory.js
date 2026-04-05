document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("product-table-body");

  fetch("../../data/product.json")
    .then((res) => res.json())
    .then((products) => {
      displayProducts(products);
      updateStats(products);
    })
    .catch((err) => console.error("Error loading products:", err));

  function displayProducts(products) {
    let rows = "";

    products.forEach((product) => {
      const variant = product.variants[0];

      const stock = variant.stock || product.stock || 0;

      let statusClass = "";
      let statusText = "";

      if (stock === 0) {
        statusClass = "out";
        statusText = "Out Of Stock";
      } else if (stock < 50) {
        statusClass = "low";
        statusText = "Low Stock";
      } else {
        statusClass = "in";
        statusText = "In Stock";
      }

      rows += `
        <tr>
          <td class="product-image">
            <img src="${variant.images[0]}" alt="${product.name}" />
          </td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${stock}</td>
          <td class="${statusClass}">${statusText}</td>
          <td>DZD ${product.price.toLocaleString()}</td>
          <td>${product.manufacturer}</td>
          <td class="actions">
            <button class="action-btn">
              <img src="../../img/icons/menu-dots.png" />
            </button>
            <div class="dropdown-menu">
              <button class="dropdown-item edit">Edit</button>
              <button class="dropdown-item delete">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows;
  }

  function updateStats(products) {
    let total = products.length;
    let low = 0;
    let out = 0;

    products.forEach((p) => {
      const stock = p.variants[0].stock || p.stock || 0;

      if (stock === 0) out++;
      else if (stock < 50) low++;
    });

    document.getElementById("total-products").textContent = total;
    document.getElementById("low-stock").textContent = low;
    document.getElementById("out-stock").textContent = out;
  }
});