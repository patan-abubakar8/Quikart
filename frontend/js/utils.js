

export const BASE_URL = 'http://localhost:8080';

export function getToken() {
  return localStorage.getItem("accessToken");
}

export function getUserId() {
  return localStorage.getItem("userId");
}

export function getAuthHeaders() {
  const token = getToken();
  return token ? { "Authorization": "Bearer " + token, "Content-Type": "application/json" } : {};
}

export function checkAuth() {
  const token = getToken();
  const userId = getUserId();
  if (!token || !userId) {
    alert("Please login first.");
    window.location.href = "login.html";
  }
}

export function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
