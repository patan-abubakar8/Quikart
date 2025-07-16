// auth.js

import { BASE_URL } from "./utils.js";

const errorMsg = document.getElementById("error-msg");

export async function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showError("Please fill in both email and password.");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (res.ok) {
      saveUserSession(result.data);
      if (result.data.role === 'ADMIN') {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      showError(result.message || "Login failed.");
    }
  } catch (err) {
    showError("Server error. Try again later.");
  }
}

export async function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    showError("All fields are required.");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await res.json();

    if (res.ok) {
      saveUserSession(result.data);
      window.location.href = "index.html";
    } else {
      showError(result.message || "Registration failed.");
    }
  } catch (err) {
    showError("Something went wrong.");
  }
}

function saveUserSession(data) {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("userEmail", data.email);
  localStorage.setItem("userRole", data.role);
}

function showError(msg) {
  if (errorMsg) {
    errorMsg.innerText = msg;
    errorMsg.style.display = "block";
  } else {
    alert(msg);
  }
}

window.loginUser = loginUser;
window.registerUser = registerUser;
