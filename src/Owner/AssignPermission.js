import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner, Collapse, Table } from "react-bootstrap";
import {addAssignPermission, addEmployee,deletePemission ,getAllUsers,getAllEmployees,addEmployeePage,addEmployeeComponent,getAllRole,saveRolesToDatabase } from "../services/rolePermissionService";
import Navbar from "../layouts/Navbar";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";
const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);   // ✅ Add users state
  const [formData, setFormData] = useState({ userName: "", roleName: "" });
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [roleData, setRoleData] = useState([]); // State for role data from DB
   const [selectedRole, setSelectedRole] = useState(""); // Store the selected role
   const [employeeRoles, setEmployeeRoles] = useState([]); // Store assigned roles
  useEffect(() => {
    fetchEmployees();
    fetchUsers();   // ✅ Fetch users when the component mounts
    fetchRole();
  }, []);
 // Fetch role data from the backend
  const fetchRole = async () => {
    try {
      const response = await getAllRole("1"); // Fetch role data
      if (response && Array.isArray(response)) {
        setRoleData(response);
      } else {
        setRoleData([]);
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
      setRoleData([]);
    }
  };
    const fetchUsers = async () => {   // ✅ Fetch users from the backend
    try {
        const response = await getAllUsers("1");   // ✅ Fetch users

        if (response && Array.isArray(response)) {
            setUsers(response);   // ✅ Set state with user data        
        } else {
            setUsers([]);   // ✅ Set users to empty array
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);   // ✅ Set users to empty array
    }
    };

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees("1");
    
      setEmployees(
        response && Array.isArray(response)
          ? response.map(emp => ({
              id: emp.id,
              userName: emp.userName,
              type: emp.type || [] // Ensure pages exists
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
      const response = await addAssignPermission(formData);
      setFormData({ userName: "", roleName: "" });
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setSelectedRole(""); // Reset role selection
  
    // Ensure employee has assigned roles before setting
    if (employee.type && Array.isArray(employee.type)) {
      setEmployeeRoles(employee.type); // Set roles dynamically
    } else {
      setEmployeeRoles([]); // Default empty if no roles assigned
    }
  
    setShowModal(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedRole) {
      alert("Please select a role before removing.");
      return;
    }
  
    setLoadingDelete(selectedEmployee.id);
    try {
      await deletePemission ({id:selectedEmployee.id, roleName:selectedRole}); // Send only assigned role
     // alert("Employee role removed successfully.");
  
      // Update local state: Remove only the selected role
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === selectedEmployee.id
            ? { ...emp, type: emp.type.filter(role => role !== selectedRole) }
            : emp
        )
      );
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
     // alert("Failed to remove employee role.");
    } finally {
      setLoadingDelete(null);
      setShowModal(false);
      setSelectedRole(""); // Reset selection
    }
  };
  
  

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setFormData({ ...formData, userName: e.target.value });
  };

  

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
       
           {checkAccessComponent("Owner","Assign Permission","Add") && (
                   <>
                     <Button
                      variant="primary"
                      onClick={() => setShowForm(!showForm)}
                      aria-controls="employee-form-collapse"
                      aria-expanded={showForm}
                    >
                      {showForm ? "Hide Form" : "Assign Role"}
                    </Button>
       
                   </>
               )}
       

        <Collapse in={showForm}>
          <div id="employee-form-collapse" className="mt-3">

           {users.length > 0 && (
            <Form.Select value={selectedUser} onChange={handleUserChange} className="me-2 mb-2" name="userName">
                <option value="">--Select User--</option>
                {users.map((user, index) => (
                <option key={index} value={user.name}>{user.name}</option>
                ))}
            </Form.Select>
            )}

        <select
            id="roleSelect"
            className="form-control mb-4"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value); // Update selected role
              setFormData({ ...formData, roleName: e.target.value });
            }}
          >
            <option value="">--Select a Role--</option>
            {roleData.map((role) => (
              <option key={role.id} value={role.roleName}>
                {role.roleName}
              </option>
            ))}
          </select>

            <Button onClick={handleAdd} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
          </div>
        </Collapse>

        <Table bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Role Name</th>
             
       
             {checkAccessComponent("Owner","Assign Permission","Delete") && (
                   <>
                    <th>Action</th>
       
                   </>
               )}
       
              
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No content in table</td>
              </tr>
            ) : (
                users.map((employee, index) => (
                <tr key={index} className="text-center">
                  <td>{employee.name}</td>
                  <td>
                    {employee.type && employee.type.length > 0
                        ? employee.type.join(", ") // Converts the array into a comma-separated string
                        : "No role"}
                    </td>

                 {checkAccessComponent("Owner","Assign Permission","Delete") && (
                   <>
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
                        "Remove"
                      )}
                    </Button>
                  </td>
       
                   </>
               )}
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Role Removal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to remove a role from <strong>{selectedEmployee?.userName}</strong>?</p>

              {/* Dropdown with only assigned roles */}
              <Form.Select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">-- Select a Role to Remove --</option>
                {employeeRoles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </Form.Select>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete} disabled={!selectedRole}>
                {loadingDelete === selectedEmployee?.id ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Removing...
                  </>
                ) : (
                  "Remove"
                )}
              </Button>
            </Modal.Footer>
          </Modal>


      </div>
    </>
  );
};

export default EmployeeManagement;
