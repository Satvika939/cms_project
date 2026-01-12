import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = await api.post("/auth/login", {
        email,
        password,
      });

      if (data.token) {
        login(data);
        navigate("/programs");
      } else {
        alert("Invalid credentials");
      }
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="brand-title">Chaishots</h1>
        <p className="brand-subtitle">
          Sign in to manage programs & content
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@chaishots.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
