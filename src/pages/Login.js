import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRole } from "../context/RoleContext"; // Import useRole
import { loginEmloyee } from "../services/employeeService";
import ErrorModal from "../context/ErrorModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setRoleData } = useRole(); // Get setRoleData from context
  const [error, setError] = useState(null);

  const handleError = (message) => {
    setError(message);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginEmloyee(email, password, handleError);
      if (response?.result === "Authenticated") {
        const sessionExpiryTime = Date.now() + 10 * 60 * 1000;

        localStorage.setItem("authToken", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("userId", email);
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("expiry", sessionExpiryTime);

        if (response?.role === "Admin") {
          navigate("/Notice");
        } else if (response?.role === "pabna") {
          //alert("You are allowed to login as a student.");
          navigate("/Pabna");
        } 
        else {
          navigate("/StudentNotice");
        }
      } else {
        setError("⚠️ Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      {error && (
        <ErrorModal show={true} message={error} onClose={() => setError(null)} />
      )}
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f4f6f9" }}>
        <div className="card p-4 shadow-lg" style={{ width: "350px", borderRadius: "10px" }}>
          <h4 className="text-center mb-3">Login</h4>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Id Number</label>
              <input
                type="text"
                className="form-control"
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                placeholder="Enter your Id Number "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password "
                className="form-control"
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
