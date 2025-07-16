// index.js

import { BASE_URL, getAuthHeaders, getUserId, checkAuth, logout } from "./utils.js";

checkAuth(); // redirect if not logged in

const productGrid = document.getElementById("productGrid");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");

let currentPage = 0;
const pageSize = 6;

window.onload = () => {
  loadProducts(currentPage);
};

window.loadProducts = async function (page = 0) {
  try {
    // Use the correct endpoint for pagination
    const res = await fetch(`${BASE_URL}/api/products/page?page=${page}&size=${pageSize}`);
    const result = await res.json();
    if (res.ok) {
      displayProducts(result.data.content);
      buildPagination(result.data.totalPages, page);
    } else {
      console.error("Error response:", result);
      alert(result.message || "Failed to load products.");
    }
  } catch (err) {
    console.error("Error loading products:", err);
    alert("Failed to load products. Please check if the backend server is running.");
  }
};

function displayProducts(products) {
  productGrid.innerHTML = "";

  if (!products || products.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((p) => {
    productGrid.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">${p.description}</p>
            <p><strong>₹${p.price}</strong></p>
            <p><span class="badge bg-secondary">${p.category?.name || "N/A"}</span></p>
            <button class="btn btn-sm btn-outline-primary" onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
}

function buildPagination(totalPages, currentPage) {
  paginationDiv.innerHTML = "";
  for (let i = 0; i < totalPages; i++) {
    paginationDiv.innerHTML += `
      <button class="btn btn-sm mx-1 ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}"
        onclick="loadProducts(${i})">${i + 1}</button>
    `;
  }
}

window.searchProducts = async function () {
  const keyword = searchInput.value.trim();
  if (!keyword) return loadProducts(0);

  try {
    const res = await fetch(`${BASE_URL}/api/products/search?name=${keyword}`);
    const result = await res.json();
    if (res.ok) {
      displayProducts(result.data);
      paginationDiv.innerHTML = "";
    } else {
      console.error("Search error response:", result);
      alert(result.message || "Search failed.");
    }
  } catch (err) {
    console.error("Search failed", err);
    alert("Search failed. Please check if the backend server is running.");
  }
};

window.addToCart = async function (productId) {
  const userId = getUserId();

  try {
    const res = await fetch(`${BASE_URL}/api/cart/${userId}/add-to-cart/${productId}?quantity=1`, {
      method: "POST",
      headers: getAuthHeaders()
    });

    const result = await res.json();
    if (res.ok) {
      alert(result.message || "Item added to cart!");
    } else {
      console.error("Add to cart error response:", result);
      alert(result.message || "Failed to add item to cart.");
    }
  } catch (err) {
    console.error("Add to cart error:", err);
    alert("Failed to add item to cart. Please check if the backend server is running.");
  }
};

window.goToCart = function() {
  window.location.href = "cart.html";
};

window.logout = logout;
