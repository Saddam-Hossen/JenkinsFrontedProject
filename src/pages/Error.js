import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2 className="text-danger">Login Failed!</h2>
      <p>Invalid email or password.</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Try Again
      </button>
    </div>
  );
};

export default Error;
