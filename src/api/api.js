const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fungsi untuk melakukan POST request
const postRequest = async (endpoint, body, token = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "1111",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong!");
    }
    return data;
  } catch (err) {
    throw new Error("Network error");
  }
};

// Fungsi untuk melakukan GET request
const getRequest = async (endpoint) => {
  try {
    const headers = {
      "ngrok-skip-browser-warning": "1111",
    };
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong!");
    }
    return data;
  } catch (err) {
    throw new Error("Network error");
  }
};

// Fungsi untuk melakukan PATCH request dengan token
const patchRequest = async (endpoint, body, token) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1111",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong!");
    }
    return data;
  } catch (err) {
    throw new Error("Network error");
  }
};

// Fungsi untuk melakukan PUT request dengan token
const putRequest = async (endpoint, body, token) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1111",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong!");
    }
    return data;
  } catch (err) {
    throw new Error("Network error");
  }
};

// Fungsi untuk melakukan DELETE request dengan token
const deleteRequest = async (endpoint, token) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "ngrok-skip-browser-warning": "1111",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong!");
    }
    return data;
  } catch (err) {
    throw new Error("Network error");
  }
};

// Fungsi registrasi pengguna
export const registerUser = (email, username, password) => {
  return postRequest("/auth/register", { email, username, password });
};

// Fungsi login pengguna
export const loginUser = (email, password) => {
  return postRequest("/auth/login", { email, password });
};

// Fungsi untuk mengambil daftar posts
export const fetchPosts = () => {
  return getRequest("/posts");
};

// Fungsi untuk mengambil komentar berdasarkan postId
export const fetchCommentsForPost = (postId) => {
  return getRequest(`/comments/${postId}`);
};

// Fungsi untuk like post
export const likePost = (postId, token) => {
  return patchRequest(`/posts/${postId}/like`, {}, token);
};

// Fungsi untuk unlike post
export const unlikePost = (postId, token) => {
  return patchRequest(`/posts/${postId}/unlike`, {}, token);
};

// Fungsi untuk membuat komentar
export const createComment = (data, token) => {
  return postRequest(`/comments`, data, token);
};

// Fungsi untuk membuat post baru
export const createPost = (data, token) => {
  return postRequest(`/posts`, data, token);
};

// Fungsi untuk update post
export const updatePost = (postId, data, token) => {
  return putRequest(`/posts/${postId}`, data, token);
};

// Fungsi untuk delete post
export const deletePost = (postId, token) => {
  return deleteRequest(`/posts/${postId}`, token);
};

// Password Reset Functions
// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const res = await fetch(`${API_BASE_URL}/password-reset`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "1111",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong!");
    }
    return data;
  } catch (err) {
    throw new Error("Network error");
  }
};

// Validate reset token
export const validateResetToken = async (token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/password-reset?token=${token}`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "1111",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong!");
    }
    return data;
  } catch (err) {
    throw new Error("Network error");
  }
};

// Reset password with token
export const resetPassword = async (token, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/password-reset/confirm`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "1111",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong!");
    }
    return data;
  } catch (err) {
    throw new Error("Network error");
  }
};

// Fungsi untuk memulai login/register Google (OAuth)
export const startGoogleOAuth = () => {
  // Ganti port sesuai backend jika perlu
  window.location.href = `${API_BASE_URL}/auth/google`;
};

// Fungsi untuk memproses token hasil redirect Google OAuth
export const handleGoogleOAuthCallback = (search) => {
  // search: window.location.search (misal: ?token=xxx)
  const params = new URLSearchParams(search);
  const token = params.get("token");
  if (token) {
    // Simpan token ke localStorage
    localStorage.setItem("token", token);
    // (Opsional) bisa fetch user info dari backend pakai token jika backend support
    return token;
  }
  return null;
};

export default {
  registerUser,
  loginUser,
  fetchPosts,
  fetchCommentsForPost,
  likePost,
  unlikePost,
  createComment,
  createPost,
  updatePost,
  deletePost,
};
