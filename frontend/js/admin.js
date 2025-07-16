
import { BASE_URL, getAuthHeaders, logout, checkAuth } from './utils.js';

window.logout = logout;

document.addEventListener('DOMContentLoaded', () => {
  checkAuth(true); // Only allow ADMIN

  loadCategories();

  const addProductForm = document.getElementById('addProductForm');
  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const productCategory = document.getElementById('productCategory').value;

    const productData = {
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
      category: {
        id: parseInt(productCategory),
      },
    };

    try {
      const res = await fetch(`${BASE_URL}/api/products/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Product added successfully!');
        addProductForm.reset();
      } else {
        alert(`Failed to add product: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product.');
    }
  });

  const addCategoryForm = document.getElementById('addCategoryForm');
  addCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const categoryName = document.getElementById('categoryName').value;

    try {
      const res = await fetch(`${BASE_URL}/api/categories/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: categoryName }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Category added successfully!');
        addCategoryForm.reset();
        loadCategories();
      } else {
        alert(`Failed to add category: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('An error occurred while adding the category.');
    }
  });
});

async function loadCategories() {
  try {
    const res = await fetch(`${BASE_URL}/api/categories/all`, {
      headers: getAuthHeaders(),
    });

    if (res.status === 403) {
      alert('Unauthorized! You are not admin.');
      return;
    }

    const result = await res.json();

    const categorySelect = document.getElementById('productCategory');
    categorySelect.innerHTML = '<option value="">Select Category</option>';

    if (res.ok && result.data) {
      result.data.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } else {
      alert('Failed to load categories.');
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    alert('An error occurred while loading categories.');
  }
}
