import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner, Collapse, Table } from "react-bootstrap";
import { addEmployee, deleteEmployee, getAllEmployees, addEmployeePage } from "../services/DeveloperService";
import Navbar from "../layouts/Navbar";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ menuName: "", pageName: "" });
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees("1");
      console.log("Employees API Response:", response); // Debugging

      setEmployees(
        response && Array.isArray(response)
          ? response.map(emp => ({
              id: emp.id,
              menuName: emp.menuName,
              pages: emp.pages || [] // Ensure pages exists
            }))
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

  const handleAdd = async () => {
    setLoading(true);
    try {
      const response = await addEmployeePage(formData);
      if (response.status === 200 && response.data) {
        alert("Successfully Inserted");
        setEmployees(prev => [
          ...prev,
          {
            id: response.data.id,
            menuName: formData.menuName,
            pages: response.data.pages || [] // Ensure pages exists
          }
        ]);
        setFormData({ menuName: "", pageName: "" });
        setShowForm(false);
        fetchEmployees();
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
    setLoadingDelete(selectedEmployee.id);
    try {
      await deleteEmployee(selectedEmployee.id, endDate);
      setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id)); // Fix delete function
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

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setFormData({ ...formData, menuName: e.target.value });
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
          {showForm ? "Hide Form" : "Add Page Name"}
        </Button>

        <Collapse in={showForm}>
          <div id="employee-form-collapse" className="mt-3">
            {employees.length > 0 && (
              <Form.Select value={selectedUser} onChange={handleUserChange} className="me-2 mb-2" name="menuName">
                <option value="">Select Employee</option>
                {employees.map((us, index) => (
                  <option key={index} value={us.menuName}>{us.menuName}</option>
                ))}
              </Form.Select>
            )}

            <Form.Control
              type="text"
              name="pageName"
              placeholder="page Name"
              value={formData.pageName}
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
              <th>menu Name</th>
              <th>page Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No content in table</td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={index} className="text-center">
                  <td>{employee.menuName}</td>
                  <td>
                    {employee.pages && employee.pages.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {employee.pages.map((menu, i) => (
                          <li key={i}>{menu.pageName}</li>
                        ))}
                      </ul>
                    ) : (
                      "No page"
                    )}
                  </td>
                  <td>
                    <Button variant="warning">Edit</Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(employee)}
                      disabled={loadingDelete === employee.id}
                    >
                      {loadingDelete === employee.id ? (
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
