const BASE = "http://127.0.0.1:8000";

function getToken() { return localStorage.getItem("token"); }

async function request(method, endpoint, body = null) {
  const token   = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res  = await fetch(`${BASE}${endpoint}`, config);
  const data = await res.json();

  // auto logout if token expired
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  return data;
}

const api = {
  get:    (endpoint)       => request("GET",    endpoint),
  post:   (endpoint, body) => request("POST",   endpoint, body),
  put:    (endpoint, body) => request("PUT",    endpoint, body),
  delete: (endpoint)       => request("DELETE", endpoint),
};

export default api;