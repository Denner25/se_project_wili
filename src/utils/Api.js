const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.wili.nya.pub"
    : "http://localhost:3001";

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

function getLatestItems() {
  return fetch(`${BASE_URL}/items/latest`, {}).then(handleResponse);
}

function getUserById(userId, token) {
  const url = userId ? `${BASE_URL}/users/${userId}` : `${BASE_URL}/users/me`;
  return fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(handleResponse);
}

function getUsers(query) {
  const url = query
    ? `${BASE_URL}/users?q=${encodeURIComponent(query)}`
    : `${BASE_URL}/users`;

  return fetch(url).then(handleResponse);
}

function createMessage(data) {
  // ✅ Include JWT automatically from localStorage
  const token = localStorage.getItem("jwt");

  return fetch(`${BASE_URL}/wili`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

function getMessages(chatId, token) {
  return fetch(`${BASE_URL}/chats/${chatId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(handleResponse);
}

function deleteMessage(messageId, token) {
  return fetch(`${BASE_URL}/messages/${messageId}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(handleResponse);
}

// utils/Api.js
function getChats(token) {
  return fetch(`${BASE_URL}/chats`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }).then(handleResponse);
}

function deleteChat(chatId, token) {
  return fetch(`${BASE_URL}/chats/${chatId}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(handleResponse);
}

export {
  getItems,
  addItem,
  deleteItem,
  updateItemMoods,
  getCurrentUser,
  updateProfile,
  handleResponse,
  getLatestItems,
  getUserById,
  getUsers,
  createMessage,
  getMessages,
  deleteMessage,
  getChats,
  deleteChat,
};
