// src/components/Register.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/slices/authSlice";
import logo from "../assets/logo.png";
import api from "../api/api"; // Import api.js

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(registerUser({ email, username, password })).unwrap();
      // Redirect ke halaman login setelah registrasi berhasil
      navigate("/login");
    } catch (error) {
      // Error sudah ditangani oleh Redux
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow p-8 flex flex-col items-center">
        <img src={logo} alt="Logo" />
        <form className="w-full flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="mb-2 px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="mb-2 px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-3 px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 rounded mt-1 hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        {/* Tombol Register Google */}
        <button
          type="button"
          onClick={api.startGoogleOAuth}
          className="w-full flex items-center justify-center mt-4 py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-200 shadow"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <g>
              <path
                fill="#4285F4"
                d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.13 2.36 30.45 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.33 13.13 17.68 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.93 37.13 46.1 31.36 46.1 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.7 16.09 0 19.95 0 24c0 4.05.7 7.91 2.69 12.24l7.98-6.2z"
              />
              <path
                fill="#EA4335"
                d="M24 48c6.45 0 12.13-2.13 16.19-5.81l-7.19-5.59c-2.01 1.35-4.59 2.15-9 2.15-6.32 0-11.67-3.63-13.33-8.79l-7.98 6.2C6.73 42.2 14.82 48 24 48z"
              />
            </g>
          </svg>
          Sign up with Google
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Login Link */}
        <p className="text-sm mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
