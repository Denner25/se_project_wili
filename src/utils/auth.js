const BASE_URL = import.meta.env.VITE_API_URL;

function handleResponse(res) {
  return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
}

function register({ name, email, password }) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then(handleResponse);
}

function login({ email, password }) {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
}

function checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);
}

export { register, login, checkToken };
