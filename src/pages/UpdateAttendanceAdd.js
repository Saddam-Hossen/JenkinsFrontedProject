import React, { useState, useEffect } from "react";
import { Table, Form, Button, Spinner, Modal } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { getAttendanceDataForFixDay, saveAttendance,updateAttendance } from "../services/attendanceDataService";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";

const AttendanceSheet = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dayStatus, setDayStatus] = useState("Office");
  const [loading, setLoading] = useState(false);
  const [oldData, setOldData] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      fetchEmployees();
    }
  }, [selectedDate]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getAttendanceDataForFixDay(selectedDate);
     
      setEmployees(Array.isArray(response) && response.length > 0 ? response : []);
      setOldData(JSON.parse(JSON.stringify(Array.isArray(response) && response.length > 0 ? response : [])));  // Deep copy
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
      setOldData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDayStatusChange = (e) => {
    const newStatus = e.target.value;
    setDayStatus(newStatus);
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => ({ ...emp, globalDayStatus: newStatus }))
    );
  };
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => ({ ...emp, status: newStatus }))
    );
  };
  
  const handleInputChange = (e, index, field) => {
    const newEmployees = [...employees];
    newEmployees[index][field] = e.target.value;
    setEmployees(newEmployees);
  };

  const handleUpdate = async () => {
    try {
      const response = await updateAttendance(employees, oldData);
      alert(response);
      fetchEmployees();
      
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const changeDate = (days) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMonthName = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", { month: "long" }).toUpperCase();
  };

  return (
    <>
    <Navbar />
    <div className="container mt-4" style={{ paddingTop: "100px" }}>
      {/* Date Controls */}
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center mb-3 gap-2">
          <Button variant="secondary" onClick={() => changeDate(-1)}>
            {"<"}
          </Button>

          <Form.Control 
            type="date" 
            value={selectedDate} 
            onChange={handleDateChange} 
          />


          <Button variant="secondary" onClick={() => changeDate(1)}>
            {">"}
          </Button>
        </div>

  
      {/* Header Info */}
      <div className="border p-3">
        <h5 className="text-center">Daily Attendance Sheet - {selectedDate ? new Date(selectedDate).getFullYear() : ""}</h5>
        <div className="d-flex justify-content-between flex-wrap mt-2">
          <span>Month: {getMonthName(selectedDate)}</span>
          <span>Date: {selectedDate}</span>
        </div>
      </div>
  
      {/* Global Status Selectors */}
      <div className="d-flex flex-column flex-md-row my-3 gap-2">
        <Form.Select
          value={employees.length > 0 ? employees[0].status : "Present"}
          onChange={handleStatusChange}
        >
          <option>Present</option>
          <option>Absent</option>
          <option>Leave</option>
          <option>Holiday</option>
        </Form.Select>
  
        <Form.Select
          value={employees.length > 0 ? employees[0].globalDayStatus : "Office"}
          onChange={handleDayStatusChange}
        >
          <option>Office</option>
          <option>Holiday</option>
        </Form.Select>
      </div>
  
      {/* Responsive Table */}
      <div style={{ overflowX: "auto" }}>
           <Table bordered hover className="table-sm">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Start Time</th>
      <th>Reason For Being Late</th>
      <th>Exit Time</th>
      <th>Reason For Early Exit</th>
      <th>Out Time</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {employees.length > 0 ? (
      employees.map((employee, index) => (
        <tr key={employee.employeeId}>
          <td>{employee.employeeId}</td>
          <td  style={{ minWidth: "120px" }}>{employee.name}</td>

          {/* Start Time */}
          <td className="d-flex flex-column flex-sm-row">
            <Form.Control
              type="text"
              value={employee.startHour}
              onChange={(e) => handleInputChange(e, index, "startHour")}
               className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
               style={{ minWidth: "50px",maxWidth: "80px" }}
            />
            <Form.Control
              type="text"
              value={employee.startMinute}
              onChange={(e) => handleInputChange(e, index, "startMinute")}
               className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
               style={{ minWidth: "50px",maxWidth: "80px" }}
            />
            <Form.Select
              value={employee.startPeriod}
              onChange={(e) => handleInputChange(e, index, "startPeriod")}
             className="w-100 w-sm-50"
             style={{ minWidth: "80px",maxWidth: "80px" }}
            >
              <option>AM</option>
              <option>PM</option>
            </Form.Select>
          </td>

          {/* Late Entry Reason */}
          <td>
            <Form.Control
              type="text"
              value={employee.lateEntryReason}
              onChange={(e) => handleInputChange(e, index, "lateEntryReason")}
              className="w-100"
              style={{ minWidth: "100px" }}
            />
          </td>

          {/* Exit Time */}
          <td className="d-flex flex-column flex-sm-row">
            <Form.Control
              type="text"
              value={employee.exitHour}
              onChange={(e) => handleInputChange(e, index, "exitHour")}
              className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
              style={{ minWidth: "50px",maxWidth: "80px" }}
             
            />
            <Form.Control
              type="text"
              value={employee.exitMinute}
              onChange={(e) => handleInputChange(e, index, "exitMinute")}
              className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
              style={{ minWidth: "50px",maxWidth: "80px" }}
            />
            <Form.Select
              value={employee.exitPeriod}
              onChange={(e) => handleInputChange(e, index, "exitPeriod")}
              className="w-100 w-sm-50"
              style={{ minWidth: "80px",maxWidth: "80px" }} // Ensure it's wide enough for text
            >
              <option>AM</option>
              <option>PM</option>
            </Form.Select>
          </td>

          {/* Early Exit Reason */}
          <td>
            <Form.Control
              type="text"
              value={employee.earlyExitReason}
              onChange={(e) => handleInputChange(e, index, "earlyExitReason")}
              className="w-100"
             style={{ minWidth: "100px" }}
            />
          </td>

          {/* Out Time */}
          <td className="d-flex flex-column flex-sm-row">
            <Form.Control
              type="text"
              value={employee.outHour}
              onChange={(e) => handleInputChange(e, index, "outHour")}
              className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
              style={{ minWidth: "50px" }}
            />
            <Form.Control
              type="text"
              value={employee.outMinute}
              onChange={(e) => handleInputChange(e, index, "outMinute")}
              className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
              style={{ minWidth: "50px" }}
            />
          </td>

          {/* Status */}
          <td>
            <Form.Select
              value={employee.status}
              onChange={(e) => handleInputChange(e, index, "status")}
              className="w-100"
              style={{ minWidth: "110px" }} // Ensure it's wide enough for text
            >
              <option>Present</option>
              <option>Absent</option>
              <option>Leave</option>
              <option>Holiday</option>
            </Form.Select>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="8" className="text-center text-danger fw-bold">
          Data not exist
        </td>
      </tr>
    )}
  </tbody>
</Table>

      </div>
  
      {/* Update Button */}
      {checkAccessComponent("Attendance", "UpdateAttendanceAdd", "Update") && employees.length > 0 && (
        <div className="text-center mt-3">
          <Button variant="success" onClick={handleUpdate}>Update</Button>
        </div>
      )}
    </div>
  
    {/* Modal */}
    <Modal show={loading} backdrop="static" centered>
      <Modal.Body className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Fetching data, please wait...</p>
      </Modal.Body>
    </Modal>
  </>
  
  );
};

export default AttendanceSheet;
