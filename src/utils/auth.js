import { handleResponse } from "./Api";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.wili.nya.pub"
    : "http://localhost:3001";

function signup({ name, email, password }) {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then(handleResponse);
}

function login({ email, password }) {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
}

function checkToken(token) {
  return fetch(`${baseUrl}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);
}

export { signup, login, checkToken };
