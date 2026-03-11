const API_BASE = '/api';

export function getAuthHeaders(getToken) {
  const token = getToken?.();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function fetchApi(path, options = {}, getToken) {
  const headers = { ...getAuthHeaders(getToken), ...options.headers };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export async function authSignup(username, password, profileImageUrl) {
  return fetchApi('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password, profileImageUrl }),
  });
}

export async function authLogin(username, password) {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function getPosts(getToken, query = '') {
  const q = query ? `?q=${encodeURIComponent(query)}` : '';
  return fetchApi(`/posts${q}`, {}, getToken);
}

export async function getPost(id, getToken) {
  return fetchApi(`/posts/${id}`, {}, getToken);
}

export async function createPost(formData, getToken) {
  const token = getToken?.();
  if (!token) throw new Error('Login required');
  const headers = { Authorization: `Bearer ${token}` };
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers,
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export async function likePost(id, getToken) {
  return fetchApi(`/posts/${id}/like`, { method: 'POST' }, getToken);
}

export async function deletePost(id, getToken) {
  return fetchApi(`/posts/${id}`, { method: 'DELETE' }, getToken);
}

export async function getAccount(getToken) {
  return fetchApi('/account', {}, getToken);
}

export async function updateAccountProfile(profileImageUrl, getToken) {
  return fetchApi(
    '/account',
    {
      method: 'PATCH',
      body: JSON.stringify({ profileImageUrl }),
    },
    getToken,
  );
}
