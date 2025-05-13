import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner, Collapse, Table } from "react-bootstrap";
import {  deleteEmployee, getAllEmployees, addEmployeeComponent } from "../services/DeveloperService";
import Navbar from "../layouts/Navbar";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ menuName: "",pageName:" ", componentName: "" });
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPage, setSelectedPage] = useState("");

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
              pages: emp.pages || [] ,// Ensure pages exists
              components: emp.components || [] // Ensure components exists
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
      const response = await addEmployeeComponent(formData);
      if (response.status === 200 && response.data) {
        alert("Successfully Inserted");
        setEmployees(prev => [
          ...prev,
          {
            id: response.data.id,
            menuName: formData.menuName,
            pageName: formData.pageName, // Ensure pages exists
            components: formData.componentName // Ensure components exists
          }
        ]);
        setFormData({ menuName: "", componentName: "" });
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
    // Make sure the deletion operation is valid
    if (window.confirm('Are you sure you want to delete this item?')) {
      // Set the loading state to prevent multiple clicks
      setLoadingDelete(employee.id);
  
      // Example API call to delete the employee
      fetch(`/api/deleteEmployee/${employee.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee), // Send the row data in the body if needed
      })
        .then(response => response.json())
        .then(data => {
          // Handle success, e.g., update the UI, show a message
          alert('Employee deleted successfully');
          // Optionally, refresh or remove the deleted row from the state
          setEmployees(employees.filter(emp => emp.id !== employee.id));
        })
        .catch(error => {
          // Handle error
          console.error('Error deleting employee:', error);
          alert('Error deleting employee');
        })
        .finally(() => {
          setLoadingDelete(null); // Reset loading state
        });
    }
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

    //  update pageName based on selected user

  };
  const handlePageChange = (event) => {
    setSelectedPage(event.target.value);
    setFormData({ ...formData, pageName: event.target.value });
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
          {showForm ? "Hide Form" : "Add component Name"}
        </Button>

        <Collapse in={showForm}>
          <div id="employee-form-collapse" className="mt-3">
           {/* User Selection */}
            <Form.Select value={selectedUser} onChange={handleUserChange} className="me-2 mb-2">
            <option value="">Select User</option>
            {employees.map((emp, index) => (
                <option key={index} value={emp.menuName}>{emp.menuName}</option>
            ))}
            </Form.Select>

            {/* Page Selection */}
            <Form.Select value={selectedPage} onChange={handlePageChange} className="me-2 mb-2">
            <option value="">Select Page</option>
            {employees.find(emp => emp.menuName === selectedUser)?.pages?.map((page, index) => (
                <option key={index} value={page.pageName}>{page.pageName}</option>
            ))}
            </Form.Select>


            <Form.Control
              type="text"
              name="componentName"
              placeholder="component Name"
              value={formData.componentName}
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
                <th>Page Name</th>
                <th>Component Name</th>
                <th>Edit</th>
                <th>Delete</th>
                </tr>
            </thead>
            <tbody>
            {(!employees || employees.length === 0) ? (
                <tr>
                <td colSpan="5" className="text-center">No content in table</td>
                </tr>
            ) : (
                employees.map((employee, empIndex) => {
                // Ensure pages exist before using reduce()
                let totalPages = employee.pages?.reduce((sum, page) => 
                    sum + (page.components ? page.components.length : 1), 0) || 0;

                return (
                    employee.pages?.map((page, pageIndex) => {
                    let totalComponents = page.components?.length || 1;

                    return (
                        (page.components && page.components.length > 0) ? (
                        page.components.map((component, compIndex) => (
                            <tr key={`${empIndex}-${pageIndex}-${compIndex}`} className="text-center">
                            {/* Menu Name spans all pages & components */}
                            {pageIndex === 0 && compIndex === 0 ? (
                                <td rowSpan={totalPages}>{employee.menuName}</td>
                            ) : null}

                            {/* Page Name spans all components */}
                            {compIndex === 0 ? (
                                <td rowSpan={totalComponents}>{page.pageName}</td>
                            ) : null}

                            <td>{component.componentName}</td>
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
                        ) : (
                        <tr key={`${empIndex}-${pageIndex}`} className="text-center">
                            {/* Menu Name spans all pages */}
                            {pageIndex === 0 ? (
                            <td rowSpan={totalPages}>{employee.menuName}</td>
                            ) : null}

                            <td>{page.pageName}</td>
                            <td>No Components</td>
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
                        )
                    );
                    }) || []
                );
                })
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
