import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Modal, Collapse, Form } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { getAllEmployees, deleteEmployee, addEmployee } from "../services/employeeService";

const EmployeeTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [formData, setFormData] = useState({ pageName: "", pagePath: "", type: "Employee" });

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees("1");
      setEmployees(Array.isArray(response) ? response : [response]);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!endDate) {
      alert("Please select an End Date before deleting.");
      return;
    }
    setLoadingDelete(selectedEmployee.pageName);
    try {
      await deleteEmployee(selectedEmployee.pageName, endDate);
      setEmployees((prev) => prev.filter((emp) => emp.pageName !== selectedEmployee.pageName));
      alert("Employee deleted successfully.");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete employee.");
    } finally {
      setLoadingDelete(null);
      setShowModal(false);
      setEndDate("");
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const response = await addEmployee(formData, employees.length + 1);
      if (response.status === 200) {
        alert("Successfully Inserted");
        setEmployees([...employees, formData]);
        setFormData({ pageName: "", pagePath: "", type: "Employee" });
        setShowForm(false);
      } else if (response.status === 409) {
        alert("Failed to Insert: Employee already exists.");
      } else {
        alert("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        <Button 
          variant="primary" 
          onClick={() => setShowForm(!showForm)} 
          aria-controls="employee-form-collapse"
          aria-expanded={showForm}
        >
          {showForm ? "Hide Form" : "Show Form"}
        </Button>

        {/* Collapsible Form */}
        <Collapse in={showForm}>
          <div id="employee-form-collapse" className="mt-3">
            <div className="d-flex flex-wrap mb-3">
              <Form.Control type="text" name="pageName" placeholder="Page Name" value={formData.pageName} onChange={handleChange} className="me-2 mb-2" />
              <Form.Control type="text" name="pagePath" placeholder="Page Path" value={formData.pagePath} onChange={handleChange} className="me-2 mb-2" />
              <Button variant="success" onClick={handleAdd} className="mb-2 d-flex align-items-center" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Adding...
                  </>
                ) : (
                  "Add"
                )}
              </Button>
            </div>
          </div>
        </Collapse>

        <Table bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>Page Name</th>
              <th>Page Path</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">No content in table</td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={index} className="text-center">
                  <td>{employee.pageName}</td>
                  <td>{employee.pagePath}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      onClick={() => handleDeleteClick(employee)}
                      disabled={loadingDelete === employee.pageName}
                    >
                      {loadingDelete === employee.pageName ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>{selectedEmployee?.pageName}</strong>?</p>
          <input 
            type="date" 
            className="form-control" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Confirm Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmployeeTable;
