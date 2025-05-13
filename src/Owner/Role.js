import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner, Collapse, Table } from "react-bootstrap";
import { addEmployee, updateRole, deleteRole, getAllRole } from "../services/rolePermissionService";
import Navbar from "../layouts/Navbar";
import { checkAccessComponent } from "../utils/accessControl";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ roleName: "" });
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllRole("1");
      setEmployees(
        response && Array.isArray(response)
          ? response.map(emp => ({ roleName: emp.roleName }))
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
    event.preventDefault();
    setLoading(true);
  
    try {
      const response = await addEmployee(formData);
      window.location.reload();
    } catch (error) {
      console.log(`Failed to add role. Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const handleEditClick = (employee) => {
    setEditingData(employee);
    setFormData({ roleName: employee.roleName }); 
    setShowForm(true); 
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
        const response = await updateRole({
            oldRoleName: editingData.roleName,
            newRoleName: formData.roleName
        });

        setEditingData(null);
        setFormData({ roleName: "" });
        setShowForm(false);
        await fetchEmployees();
    } catch (error) {
        console.error("Update error:", error); // Debugging
       // alert("Error updating role.");
    } finally {
        setLoading(false);
    }
};


  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setLoadingDelete(selectedEmployee.roleName);
    
    try {
      const response = await deleteRole({ id: selectedEmployee.roleName });
      setEmployees(prev => prev.filter(emp => emp.roleName !== selectedEmployee.roleName));
    } catch (error) {
      console.log(error.response?.data || "An error occurred while deleting the role.");
    } finally {
      setLoadingDelete(null);
      setShowModal(false);
      setSelectedEmployee(null);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4 " style={{ paddingTop: "100px" }}>
        {checkAccessComponent("Owner", "Role", "Add") && (
          <Button
            variant="primary"
            onClick={() => { setShowForm(!showForm); setEditingData(null); setFormData({ roleName: "" }); }}
            aria-controls="employee-form-collapse"
            aria-expanded={showForm}
          >
            {showForm ? "Hide Form" : editingData ? "Edit Role" : "Add Role Name"}
          </Button>
        )}

        <Collapse in={showForm}>
          <div id="employee-form-collapse" className="mt-3">
            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                name="roleName"
                placeholder="Role Name"
                value={formData.roleName}
                onChange={handleChange}
                className="me-2"
                style={{ width: "30%" }} // Reduced input width
              />
              <Button onClick={editingData ? handleUpdate : handleAdd} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : (editingData ? "Update" : "Add Role")}
              </Button>
            </div>
          </div>
        </Collapse>


        <Table bordered hover responsive className="mt-4"  style={{ width: "60%" }}>
          <thead>
            <tr>
              <th>Role Name</th>
              {checkAccessComponent("Owner", "Role", "Edit") && <th>Edit</th>}
              {checkAccessComponent("Owner", "Role", "Delete") && <th>Delete</th>}
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
                  <td>{employee.roleName}</td>
                  {checkAccessComponent("Owner", "Role", "Edit") && (
                    <td>
                      <Button variant="warning" onClick={() => handleEditClick(employee)}>Edit</Button>
                    </td>
                  )}
                  {checkAccessComponent("Owner", "Role", "Delete") && (
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(employee)}
                        disabled={loadingDelete === employee.roleName}
                      >
                        {loadingDelete === employee.roleName ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </td>
                  )}
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
            <p>Are you sure you want to delete <strong>{selectedEmployee?.roleName}</strong>?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete} disabled={loadingDelete !== null}>
              {loadingDelete !== null ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default EmployeeManagement;
