import React, { useState,useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { getAllEmployees } from "../services/employeeService";
import { saveAttendance } from "../services/attendanceDataService";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";


const AttendanceSheet = () => {
  const [user, setUser] = useState([])
  const [employees, setEmployees] = useState([ 
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [dayStatus, setDayStatus] = useState("Office");
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setEmployees([...employees.map(emp => ({ ...emp, date: e.target.value }))]);
  };
  const handleDayStatusChange = (e) => {
    const newStatus = e.target.value;
    setDayStatus(newStatus);
    
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => ({ ...emp, globalDayStatus: newStatus }))
    );
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long" }).toUpperCase();
  };
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees("1");
      
        if (Array.isArray(response)) {
          setEmployees(response.map(emp => ({
            date: selectedDate,
            employeeId: emp.idNumber, // Fixed syntax error
            name: emp.name,
            startHour: "9",
            startMinute: "0",
            lateEntryReason: "",
            startPeriod: "AM",
            exitHour: "5",
            exitMinute: "0",
            exitPeriod: "PM",
            earlyExitReason:"",
            outHour: "0",
            outMinute: "0",
            updateStatus: "1",
            globalDayStatus: dayStatus,
            status: "Present"

          })));
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => ({
        ...emp,
        date: selectedDate
      }))
    );
  }, [selectedDate]);
  
  const handleInputChange = (e, index, field) => {
    const newEmployees = [...employees];
    newEmployees[index][field] = e.target.value;
    setEmployees(newEmployees);
  };

  const handleSubmit = async () => {
   
    const response = await saveAttendance(employees);
    alert(response.message);
  };
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => ({ ...emp, status: newStatus }))
    );
  };
  const changeDate = (days) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };
  return (
    <>
    <Navbar />
  
    <div className="container mt-4" style={{ paddingTop: "100px" }}>
      {/* Date & Navigation */}
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center mb-3 gap-2">
          <Button variant="secondary" className="me-md-2" onClick={() => changeDate(-1)}>{"<"}</Button>
          
          <Form.Control 
            type="date" 
            value={selectedDate} 
            onChange={handleDateChange} 
            className="me-md-2 flex-grow-1" 
          />  
          
          <Button variant="secondary" onClick={() => changeDate(1)}>{">"}</Button>
        </div>



  
      {/* Header */}
      <div className="border p-3">
        <h5 className="text-center">Daily Attendance Sheet - {new Date(selectedDate).getFullYear()}</h5>
        <div className="d-flex justify-content-between flex-wrap mt-2">
          <span>Month: {getMonthName(selectedDate)}</span>
          <span>Date: {selectedDate}</span>
        </div>
      </div>
  
      {/* Status Select */}
      <div className="d-flex flex-wrap gap-2 my-3">
        <Form.Select className="me-2 flex-grow-1" onChange={handleStatusChange}>
          <option>Present</option>
          <option>Absent</option>
          <option>Leave</option>
          <option>Holiday</option>
        </Form.Select>
  
        <Form.Select className="flex-grow-1" value={dayStatus} onChange={(e) => handleDayStatusChange(e)}>
          <option>Office</option>
          <option>Holiday</option>
        </Form.Select>
      </div>
  
      {/* Responsive Table Scroll */}
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
    {employees.map((employee, index) => (
      <tr key={employee.employeeId}>
        <td>{employee.employeeId}</td>
        <td style={{ minWidth: "120px" }}>{employee.name}</td>
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
            style={{ minWidth: "80px",maxWidth: "80px" }} // Ensure it's wide enough for text
          >
            <option>AM</option>
            <option>PM</option>
          </Form.Select>
        </td>
        <td>
          <Form.Control
            type="text"
            value={employee.lateEntryReason}
            onChange={(e) => handleInputChange(e, index, "lateEntryReason")}
            className="w-100"
            style={{ minWidth: "100px" }}
          />
        </td>
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
        <td>
          <Form.Control
            type="text"
            value={employee.earlyExitReason}
            onChange={(e) => handleInputChange(e, index, "earlyExitReason")}
            className="w-100"
            style={{ minWidth: "100px" }}
          />
        </td>
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
    ))}
  </tbody>
</Table>




      </div>
  
      {/* Submit Button */}
      {checkAccessComponent("Attendance", "AttendanceAdd", "Submit") && (
        <div className="text-center mt-3">
          <Button variant="success" onClick={handleSubmit}>Submit</Button>
        </div>
      )}
    </div>
  </>
  
  
  );
};

export default AttendanceSheet;
