import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner, Collapse, Table } from "react-bootstrap";
import { addEmployee, deleteEmployee, getAllEmployees } from "../services/DeveloperService";
import Navbar from "../layouts/Navbar";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ menuName: "" });
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees("1");
      console.log(response);  
      setEmployees(
        response && Array.isArray(response)
          ? response.map(emp => ({ menuName: emp.menuName }))
          : []
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (event) => {
    event.preventDefault();  // Prevents unintended form submission
    setLoading(true);
    try {
      const response = await addEmployee(formData);
      console.log("New Employee Added:", response);

      if (response.status === 200 && response.data) {
        alert("Successfully Inserted");
        setFormData({ menuName: "" });
        setShowForm(false);
        await fetchEmployees();
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

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!endDate) {
      alert("Please select an End Date before deleting.");
      return;
    }
    setLoadingDelete(selectedEmployee.menuName);
    try {
      await deleteEmployee(selectedEmployee.menuName, endDate);
      setEmployees(prev => prev.filter(emp => emp.menuName !== selectedEmployee.menuName));
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
          {showForm ? "Hide Form" : "Add menu Name"}
        </Button>

        <Collapse in={showForm}>
          <div id="employee-form-collapse" className="mt-3">
            <Form.Control
              type="text"
              name="menuName"
              placeholder="menu Name"
              value={formData.menuName}
              onChange={handleChange}
              className="me-2 mb-2"
            />
            <Button onClick={handleAdd} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
          </div>
        </Collapse>

        <Table bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>Menu Name</th>
              <th>Edit</th>
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
                 <td>{employee.menuName}</td>

                  <td>
                    <Button variant="warning">Edit</Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(employee)}
                      disabled={loadingDelete === employee.menuName}
                    >
                      {loadingDelete === employee.menuName ? (
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

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete <strong>{selectedEmployee?.menuName}</strong>?</p>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default EmployeeManagement;