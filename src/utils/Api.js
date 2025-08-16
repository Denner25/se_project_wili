const BASE_URL = import.meta.env.VITE_API_URL;

function handleResponse(res) {
  return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
}

function getItems(token) {
  return fetch(`${BASE_URL}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);
}

function addItem(data, token) {
  return fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

function deleteItem(_id, token) {
  return fetch(`${BASE_URL}/items/${_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);
}

function updateItemMoods(_id, moods, token) {
  return fetch(`${BASE_URL}/items/${_id}/moods`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ moods }),
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
  addItem,
  deleteItem,
  updateItemMoods,
  getCurrentUser,
  updateProfile,
};
