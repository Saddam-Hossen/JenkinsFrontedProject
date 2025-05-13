import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../layouts/Navbar";
import { addLocalSettingData, getAllLocalData, deleteLocalData, updateLocalSettingData} from "../services/LocalSettingService";
import { getAllEmployees } from "../services/employeeService";
import { checkAccessComponent } from "../utils/accessControl";

const DataTable = () => {
  const [selectedParson, setSelectedParson] = useState();
  const [selectedId, setSelectedId] = useState();
  const [employees, setEmployees] = useState([]);
  const [rows, setRows] = useState([]);
  const [user, setUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Flag to check if we're editing
  const [editRow, setEditRow] = useState({}); // To hold the row data being edited
  const [newRow, setNewRow] = useState({
    employeeId: "",
    name: "",
    formattedBirthDate: "",
    formattedDeathDate: "",
    startHours: 0,
    startMinute: 0,
    endHours: 0,
    endMinute: 0,
    totalHours: 0,
    designation: ""
  });

  const fetchLocalData = async () => {
    try {
      const response = await getAllLocalData();
      setRows(response);

      const response1 = await getAllEmployees("1");
      setUser(response1);
      setSelectedId(response1[0].idNumber);
      setSelectedParson(response1[0].name);
    } catch (error) {
      console.error("Error fetching global data:", error);
    }
  };

  useEffect(() => {
    fetchLocalData();
  }, []);

  const handleNewButtonClick = () => {
    let startDate;
    const matchingRows = rows.filter(row => row.name === selectedParson);
    if (matchingRows.length > 0) {
      // print table data in console not rows
      const firstRowDate = new Date(matchingRows[0].formattedDeathDate);
      console.log(firstRowDate);
      startDate = new Date(firstRowDate);
      startDate.setDate(startDate.getDate() + 1);

      console.log(startDate);
    } else {
      startDate = new Date(); // Default to today if no rows exist
    }

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    setNewRow({
      employeeId: selectedId,
      name: selectedParson,
      formattedBirthDate: startDate.toISOString().split("T")[0],
      formattedDeathDate: endDate.toISOString().split("T")[0],
      startHours: 0,
      startMinute: 0,
      endHours: 0,
      endMinute: 0,
      totalHours: 0,
      designation: ""
    });

    setIsEditing(false); // Not editing, so it's for creating new row
    setShowModal(true);
  };

  const handleEditButtonClick = (row) => {
    setEditRow(row);
    setNewRow({
      id: row.id, // Store the row ID
      ...row,
      formattedBirthDate: row.formattedBirthDate,
      formattedDeathDate: row.formattedDeathDate,
      startHours: row.startHours,
      startMinute: row.startMinute,
      endHours: row.endHours,
      endMinute: row.endMinute,
      totalHours: row.totalHours,
      designation: row.designation
    });
    setIsEditing(true); // Flag to show it's an edit operation
    setShowModal(true);
  };

  const handleInputChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        // Ensure newRow has an ID before updating
        if (!newRow.id) {
          alert("Error: Missing ID for updating the row.");
          return;
        }
       
        const response = await updateLocalSettingData(newRow);
        
       
      } else {
        // Add new row
        const response = await addLocalSettingData(newRow);

      }
      
      setShowModal(false);
      fetchLocalData(); // Refresh data after update/add
    } catch (error) {
      console.error("Failed to save entry:", error);
      alert("An error occurred while saving. Please try again.");
    }
  };
  

  const deleteRow = async (row, index) => {
    setRows(rows.filter((_, i) => i !== index));
    try {
      const response = await deleteLocalData(row);
      fetchLocalData();
      alert(response.replace(/^"|"$/g, ""));
    } catch (error) {
      console.error("Error fetching global data:", error);
    }
  };

  const handleUserChange = (e) => {
    setSelectedParson(e.target.value);
    const selectedUser = user.find((us) => us.name === e.target.value);
    setSelectedId(selectedUser.idNumber);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        <div className="d-flex align-items-center me-2" style={{ width: "30%" }}>
          <Form.Select value={selectedParson} className="me-2" onChange={(e) => handleUserChange(e)}>
            {user.map((us, index) => (
              <option key={index}>{us.name}</option>
            ))}
          </Form.Select>

          {checkAccessComponent("User", "LocalSetting", "Add") && (
            <Button variant="primary" className="me-2" onClick={handleNewButtonClick}>
              New
            </Button>
          )}

          {checkAccessComponent("User", "LocalSetting", "History") && (
            <Button variant="secondary">History</Button>
          )}
        </div>

        <Table bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Start Hours</th>
              <th>Start Minute</th>
              <th>End Hours</th>
              <th>End Minute</th>
              <th>Total Hours</th>
              <th>Designation</th>
              {checkAccessComponent("User", "LocalSetting", "Edit") && <th>Edit</th>}
              {checkAccessComponent("User", "LocalSetting", "Delete") && <th>Delete</th>}
            </tr>
          </thead>
          <tbody>
            {rows.filter((row) => row.employeeId === selectedId).map((row, index) => (
              <tr key={index}>
                <td>{row.formattedBirthDate}</td>
                <td>{row.formattedDeathDate}</td>
                <td>{row.startHours}</td>
                <td>{row.startMinute}</td>
                <td>{row.endHours}</td>
                <td>{row.endMinute}</td>
                <td>{row.totalHours}</td>
                <td>{row.designation}</td>

                {checkAccessComponent("User", "LocalSetting", "Edit") && (
                  <td>
                    <Button variant="warning" onClick={() => handleEditButtonClick(row)}>
                      Edit
                    </Button>
                  </td>
                )}

                {checkAccessComponent("User", "LocalSetting", "Delete") && (
                  <td>
                    <Button variant="danger" onClick={() => deleteRow(row, index)}>
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

    {/* Modal for adding or editing a row */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>{isEditing ? "Edit Entry" : "Add New Entry"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      
      {/* Hidden field for ID (Only used in edit mode) */}
      {isEditing && (
        <Form.Group controlId="rowId">
          <Form.Control type="hidden" value={newRow.id} />
        </Form.Group>
      )}
      {/* Employee Name */}
      <Form.Group controlId="employeeId">
        <Form.Label>Employee Name</Form.Label>
        <Form.Control
          type="text"
          value={newRow.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          disabled={isEditing} // Disable editing the employee name when editing
        />
      </Form.Group>

      {/* Start Date */}
      <Form.Group controlId="formattedBirthDate">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          value={newRow.formattedBirthDate}
          onChange={(e) => handleInputChange("formattedBirthDate", e.target.value)}
        />
      </Form.Group>

      {/* End Date */}
      <Form.Group controlId="formattedDeathDate">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={newRow.formattedDeathDate}
          onChange={(e) => handleInputChange("formattedDeathDate", e.target.value)}
        />
      </Form.Group>

      {/* Start Hours */}
      <Form.Group controlId="startHours">
        <Form.Label>Start Hours</Form.Label>
        <Form.Control
          type="number"
          value={newRow.startHours}
          onChange={(e) => handleInputChange("startHours", e.target.value)}
        />
      </Form.Group>

      {/* Start Minutes */}
      <Form.Group controlId="startMinute">
        <Form.Label>Start Minute</Form.Label>
        <Form.Control
          type="number"
          value={newRow.startMinute}
          onChange={(e) => handleInputChange("startMinute", e.target.value)}
        />
      </Form.Group>

      {/* End Hours */}
      <Form.Group controlId="endHours">
        <Form.Label>End Hours</Form.Label>
        <Form.Control
          type="number"
          value={newRow.endHours}
          onChange={(e) => handleInputChange("endHours", e.target.value)}
        />
      </Form.Group>

      {/* End Minutes */}
      <Form.Group controlId="endMinute">
        <Form.Label>End Minute</Form.Label>
        <Form.Control
          type="number"
          value={newRow.endMinute}
          onChange={(e) => handleInputChange("endMinute", e.target.value)}
        />
      </Form.Group>

      {/* Total Hours */}
      <Form.Group controlId="totalHours">
        <Form.Label>Total Hours</Form.Label>
        <Form.Control
          type="number"
          value={newRow.totalHours}
          onChange={(e) => handleInputChange("totalHours", e.target.value)}
        />
      </Form.Group>

      {/* Designation */}
      <Form.Group controlId="designation">
        <Form.Label>Designation</Form.Label>
        <Form.Control
          type="text"
          value={newRow.designation}
          onChange={(e) => handleInputChange("designation", e.target.value)}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSave}>
      Save
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};

export default DataTable;
