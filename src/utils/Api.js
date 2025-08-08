const BASE_URL = import.meta.env.VITE_API_URL;

function handleResponse(res) {
  return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
}

function getItems(token) {
  return fetch(`${BASE_URL}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);
}

function createItem(data, token) {
  return fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

function deleteItem(itemId, token) {
  return fetch(`${BASE_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);
}

function updateItemTags(itemId, tags, token) {
  return fetch(`${BASE_URL}/items/${itemId}/tags`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tags }),
  }).then(handleResponse);
}

function updateItem(itemId, data, token) {
  return fetch(`${BASE_URL}/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

function getCurrentUser(token) {
  return fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);
}

function updateProfile(data, token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

export {
  getItems,
  createItem,
  deleteItem,
  updateItemTags,
  updateItem,
  getCurrentUser,
  updateProfile,
};
