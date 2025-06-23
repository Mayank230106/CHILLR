import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("/api/v1/users/login", form);
      if (res.data && res.data.data && res.data.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        window.dispatchEvent(new Event("user-auth-changed"));
        navigate("/cart");
      }
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>Login</h2>
      <form
        style={{ maxWidth: "400px", margin: "auto" }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Username or Email"
          name="username"
          required
          value={form.username}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          value={form.password}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#00c6fb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            width: "100%",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {message && (
          <div style={{ marginTop: "16px", color: "#ffbaba" }}>{message}</div>
        )}
      </form>
    </div>
  );
}
