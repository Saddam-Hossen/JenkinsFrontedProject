import React, { useState } from "react";
import { addEmployee } from "../services/employeeService"; // Import the service
import "bootstrap/dist/css/bootstrap.min.css";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    idNumber: "",
    name: "",
    designation: "",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addEmployee(formData);
      setMessage("Employee added successfully!");

      // Reset form
      setFormData({
        idNumber: "",
        name: "",
        designation: "",
        joinDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      setMessage("Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h4 className="text-center mb-3">Employee Registration</h4>

        {message && (
          <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`} role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ID</label>
            <input
              type="text"
              name="idNumber"
              className="form-control"
              placeholder="Enter Employee ID"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Designation</label>
            <input
              type="text"
              name="designation"
              className="form-control"
              placeholder="Enter Designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Join Date</label>
            <input
              type="date"
              name="joinDate"
              className="form-control"
              value={formData.joinDate}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
