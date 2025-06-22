import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [avatar, setAvatar] = useState(null);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (avatar) formData.append("avatar", avatar);

      const res = await axios.post("/api/v1/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Save user info to localStorage
      if (res.data && res.data.data) {
        localStorage.setItem("user", JSON.stringify(res.data.data));
        window.dispatchEvent(new Event("user-auth-changed"));
      }
      // Redirect to cart
      navigate("/cart");
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>Create Account</h2>
      <form
        style={{ maxWidth: "400px", margin: "auto" }}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input
          type="text"
          placeholder="Name"
          name="fullname"
          required
          value={form.fullname}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Username"
          name="username"
          required
          value={form.username}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          required
          value={form.email}
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
        <label
          style={{
            color: "#a7bfe8",
            marginBottom: "8px",
            display: "block",
          }}
        >
          Avatar Image (required):
        </label>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          required
          onChange={handleAvatarChange}
          style={{ width: "100%", marginBottom: "16px" }}
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
          {loading ? "Registering..." : "Register"}
        </button>
        {message && (
          <div style={{ marginTop: "16px", color: "#ffbaba" }}>{message}</div>
        )}
      </form>
    </div>
  );
}