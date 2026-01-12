const API_BASE = 'http://localhost:4000';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...options.headers,
    },
  });

  // 🔐 Global auth handling
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

const api = {
  get: (url) =>
    request(url, {
      method: 'GET',
    }),

  post: (url, body) =>
    request(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: (url, body) =>
    request(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: (url) =>{
   
    request(url, {
      method: 'DELETE',
    })},

};

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default api;
