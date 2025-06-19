export default function Signup() {
  return (
    <div style={{ padding: "24px" }}>
      <h2>Create Account</h2>
      <form style={{ maxWidth: "400px", margin: "auto" }}>
        <input type="text" placeholder="Name" style={{ width: "100%", marginBottom: "12px", padding: "8px" }} />
        <input type="email" placeholder="Email" style={{ width: "100%", marginBottom: "12px", padding: "8px" }} />
        <input type="password" placeholder="Password" style={{ width: "100%", marginBottom: "12px", padding: "8px" }} />
        <button type="submit" style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
