import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../layouts/Navbar";
import { addGlobalSettingData, getAllGlobalData, updateGlobalData, updateGlobalDataDEl } from "../services/globalSettingService";
import { checkAccessComponent } from "../utils/accessControl";

const DataTable = () => {
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [newRow, setNewRow] = useState({
    formattedBirthDate: "",
    formattedDeathDate: "",
    lateMinute: 0,
    earlyMinute: 0,
  });

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const fetchGlobalData = async () => {
    try {
      const response = await getAllGlobalData();
      setRows(response);
    } catch (error) {
      console.error("Error fetching global data:", error);
    }
  };

  const handleNewButtonClick = () => {
    setIsEditing(false);
    setSelectedRowId(null);

    let startDate;
    if (rows.length > 0) {
      const firstRowDate = new Date(rows[0].formattedDeathDate);
      startDate = new Date(firstRowDate);
      startDate.setDate(startDate.getDate() + 1);
    } else {
      startDate = new Date();
    }

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    setNewRow({
      formattedBirthDate: startDate.toISOString().split("T")[0],
      formattedDeathDate: endDate.toISOString().split("T")[0],
      lateMinute: 0,
      earlyMinute: 0,
    });

    setShowModal(true);
  };

  const handleEditClick = (row) => {
    setIsEditing(true);
    setSelectedRowId(row.id);
    setNewRow({
      formattedBirthDate: row.formattedBirthDate,
      formattedDeathDate: row.formattedDeathDate,
      lateMinute: row.lateMinute,
      earlyMinute: row.earlyMinute,
    });

    setShowModal(true);
  };

  const handleInputChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateGlobalData(selectedRowId, newRow);
      } else {
        await addGlobalSettingData(newRow);
      }

      setShowModal(false);
      fetchGlobalData();
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  };

  const deleteRow = async (row, index) => {
    
    try {
      await updateGlobalDataDEl(row.id,row);
      fetchGlobalData();
    } catch (error) {
      console.error("Error deleting global data:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        {checkAccessComponent("Setting", "GlobalSetting", "Add") && (
          <Button variant="primary" className="me-2" onClick={handleNewButtonClick}>
            New
          </Button>
        )}

        <Table bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Late Minute</th>
              <th>Early Minute</th>
              {checkAccessComponent("Setting", "GlobalSetting", "Edit") && <th>Edit</th>}
              {checkAccessComponent("Setting", "GlobalSetting", "Delete") && <th>Delete</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.formattedBirthDate}</td>
                <td>{row.formattedDeathDate}</td>
                <td>{row.lateMinute}</td>
                <td>{row.earlyMinute}</td>
                {checkAccessComponent("Setting", "GlobalSetting", "Edit") && (
                  <td>
                    <Button variant="warning" onClick={() => handleEditClick(row)}>Edit</Button>
                  </td>
                )}
                {checkAccessComponent("Setting", "GlobalSetting", "Delete") && (
                  <td>
                    <Button variant="danger" onClick={() => deleteRow(row, index)}>Delete</Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Entry" : "Add New Entry"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newRow.formattedBirthDate}
                onChange={(e) => handleInputChange("formattedBirthDate", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newRow.formattedDeathDate}
                onChange={(e) => handleInputChange("formattedDeathDate", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Late Minute</Form.Label>
              <Form.Control
                type="number"
                value={newRow.lateMinute}
                onChange={(e) => handleInputChange("lateMinute", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Early Minute</Form.Label>
              <Form.Control
                type="number"
                value={newRow.earlyMinute}
                onChange={(e) => handleInputChange("earlyMinute", e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditing ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DataTable;
