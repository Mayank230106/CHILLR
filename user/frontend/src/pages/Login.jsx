export default function Login() {
  return (
    <div style={{ padding: "24px" }}>
      <h2>Login</h2>
      <form style={{ maxWidth: "400px", margin: "auto" }}>
        <input type="email" placeholder="Email" style={{ width: "100%", marginBottom: "12px", padding: "8px" }} />
        <input type="password" placeholder="Password" style={{ width: "100%", marginBottom: "12px", padding: "8px" }} />
        <button type="submit" style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none" }}>
          Login
        </button>
      </form>
    </div>
  );
}
