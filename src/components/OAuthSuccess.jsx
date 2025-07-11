import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../store/slices/authSlice";

const OAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);

      // Decode token untuk ambil data user
      const decoded = jwtDecode(token);
      const user = {
        userId: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };
      localStorage.setItem("user", JSON.stringify(user));

      // Update Redux state
      dispatch(setUser(user));

      // Redirect ke halaman utama
      navigate( import.meta.env.VITE_CLIENT_URL || "/");
    }
  }, [dispatch, navigate]);

  return <div>Login berhasil, redirect...</div>;
};

export default OAuthSuccess;
