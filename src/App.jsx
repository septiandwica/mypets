import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeAuth, logout } from "./store/slices/authSlice";
import { hidePostForm } from "./store/slices/postsSlice";
import NavBar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Feed from "./components/Feed";
import PostForm from "./components/PostForm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import NotFound from "./components/NotFound";
import OAuthSuccess from "./components/OAuthSuccess";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { showPostForm } = useSelector((state) => state.posts);

  // Initialize auth state from localStorage
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Redirect ke '/' jika user sudah login dan akses /login
  function LoginRedirector() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
      if (isAuthenticated && location.pathname === "/login") {
        navigate("/");
      }
    }, [isAuthenticated, location, navigate]);
    return null;
  }

  // Fungsi untuk menutup post form
  const handleClosePostForm = () => {
    dispatch(hidePostForm());
  };

  return (
    <Router>
      <LoginRedirector />
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Feed /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showPostForm && <PostForm onClose={handleClosePostForm} />}
    </Router>
  );
}

export default App;
