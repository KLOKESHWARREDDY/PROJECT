import { useState } from "react";
import "./Login.css";

function Login() {
  const [role, setRole] = useState("student");

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="logo">ES</div>

        <h2>Welcome Back</h2>
        <p className="subtitle">
          Login to continue using EventSphere
        </p>

        {/* Role switch */}
        <div className="role-switch">
          <button
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={role === "teacher" ? "active" : ""}
            onClick={() => setRole("teacher")}
          >
            Teacher
          </button>
        </div>

        {/* Email */}
        <label>Email Address</label>
        <input
          type="email"
          placeholder="student@university.edu"
        />

        {/* Password */}
        <label>Password</label>
        <input
          type="password"
          placeholder="********"
        />

        <div className="forgot">Forgot Password?</div>

        <button className="login-btn">Login</button>

        <p className="register-text">
          Don’t have an account? <span>Register</span>
        </p>

      </div>
    </div>
  );
}

export default Login;
