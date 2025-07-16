// cart.js

import { BASE_URL, getAuthHeaders, getUserId, checkAuth, logout } from "./utils.js";

checkAuth(); // Redirect if not logged in

const cartItemsDiv = document.getElementById("cartItems");
const totalAmountSpan = document.getElementById("totalAmount");

const userId = getUserId();

window.onload = () => {
  fetchCart();
};

async function fetchCart() {
  try {
    const res = await fetch(`${BASE_URL}/api/cart/cart-details/${userId}`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();

    const items = result.data.items;
    let total = 0;

    cartItemsDiv.innerHTML = "";

    if (!items || items.length === 0) {
      cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
      totalAmountSpan.innerText = "0";
      return;
    }

    // Calculate total manually to ensure accuracy
    items.forEach((item) => {
      // Add to total
      total += item.totalPrice;
      
      cartItemsDiv.innerHTML += `
        <div class="card mb-3">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5>${item.product.name}</h5>
              <p>Qty: ${item.quantity} × ₹${item.product.price}</p>
              <p><strong>₹${item.totalPrice}</strong></p>
            </div>
            <button class="btn btn-outline-danger btn-sm" onclick="removeItem(${item.id})">Remove</button>
          </div>
        </div>
      `;
    });

    // Update total amount display
    totalAmountSpan.innerText = total.toFixed(2);

  } catch (err) {
    console.error("Error fetching cart:", err);
    alert("Failed to load cart.");
  }
}

window.removeItem = async function (itemId) {
  if (!confirm("Remove this item from cart?")) return;

  try {
    const res = await fetch(`${BASE_URL}/api/cart/remove-item/${itemId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    const result = await res.json();
    alert(result.message || "Item removed.");
    // Fetch cart to update the UI with latest cart data
    await fetchCart();

  } catch (err) {
    console.error("Remove item failed:", err);
    alert("Failed to remove item.");
  }
};

window.clearCart = async function () {
  if (!confirm("Clear your cart?")) return;

  try {
    const res = await fetch(`${BASE_URL}/api/cart/${userId}/clear-cart`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    const result = await res.json();
    alert(result.message || "Cart cleared.");
    // Use await to ensure UI is updated after clearing cart
    await fetchCart();
    return true; // Return success for chaining

  } catch (err) {
    console.error("Clear cart error:", err);
    alert("Failed to clear cart.");
    return false; // Return failure for chaining
  }
};

window.placeOrder = async function () {
  try {
    // Create order request from cart items
    const cartRes = await fetch(`${BASE_URL}/api/cart/cart-details/${userId}`, {
      headers: getAuthHeaders(),
    });
    const cartResult = await cartRes.json();
    const cartItems = cartResult.data.items;
    
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    
    // Create order request object
    const orderRequest = {
      userId: userId,
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };
    
    // Send order request
    const res = await fetch(`${BASE_URL}/api/orders/place-order`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderRequest)
    });

    const result = await res.json();
    if (res.ok) {
      alert(result.message || "Order placed successfully.");
      // Clear cart after successful order
      await clearCart();
      window.location.href = "order.html";
    } else {
      alert(result.message || "Order failed.");
    }

  } catch (err) {
    console.error("Order failed", err);
    alert("Something went wrong while placing your order.");
  }
};

window.logout = logout;
