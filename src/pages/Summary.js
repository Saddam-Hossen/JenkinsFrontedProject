import React, { useState, useEffect, useRef, useCallback } from "react";
import { Table, Form, Button, Modal, Spinner } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { getAttendanceDataForAnyPeriod, exportDownloadAllAttendanceData,exportSummaryAttendanceData } from "../services/attendanceDataService";
import { getAllEmployees } from "../services/employeeService";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";

const AttendanceSheet = () => {
  const [employees, setEmployees] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const latestRequestRef = useRef(0);
  const [users, setUsers] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  // Fetch Attendance Data
  useEffect(() => {
    if (!startDate || !endDate || !employeeId || new Date(startDate) > new Date(endDate)) return;

    let requestId = ++latestRequestRef.current;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await getAttendanceDataForAnyPeriod(employeeId, employeeName, startDate, endDate);
        if (requestId === latestRequestRef.current) {
           console.log("Response:", response); // Log the response for debugging
          if (Array.isArray(response)) {
            const sortedData = response.sort((a, b) => {
              const dateA = new Date(a.date); // Assuming your date key is named "date"
              const dateB = new Date(b.date);
              return dateA - dateB;
            });
            setEmployees(sortedData);
          } else {
            setEmployees([]);
          }
          
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Employees
  const fetchEmployees = useCallback(async () => {
    let requestId = ++latestRequestRef.current;
    setLoading(true);
    try {
      const response = await getAllEmployees("1");
      if (requestId === latestRequestRef.current && response.length > 0) {
        setUsers(response);
        setEmployeeId(response[0].idNumber);
        setEmployeeName(response[0].name);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle Employee Selection Change
  const handleUserChange = (e) => {
    const selectedName = e.target.value;
    setEmployeeName(selectedName);
    const selectedUser = users.find((us) => us.name === selectedName);
    if (selectedUser) setEmployeeId(selectedUser.idNumber);
  };

 // Export Data
const exportData = async () => {
  setLoading(true);
  const success = await exportSummaryAttendanceData(employees);
  setLoading(false);

  if (success) {
    alert("Exported successfully to Download directory");
  } else {
    alert("Export failed. Please check your internet or try again later.");
  }
};
const fetchingData = async () => {
  if (!startDate || !endDate || !employeeId || new Date(startDate) > new Date(endDate)) return;

  let requestId = ++latestRequestRef.current;
  setLoading(true);

  const fetchData = async () => {
    try {
      const response = await getAttendanceDataForAnyPeriod(employeeId, employeeName, startDate, endDate);
      if (requestId === latestRequestRef.current) {
       
        setEmployees(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}
return (
  <>
    <Navbar />
    <div className="container mt-4" style={{ paddingTop: "100px" }}>
    <div className="row align-items-center mb-3">
  {/* Start Date */}
  <div className="col-12 col-md-2 mb-2">
    <Form.Control
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
  </div>

  {/* End Date */}
  <div className="col-12 col-md-2 mb-2">
    <Form.Control
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </div>

  {/* Dropdown */}
  <div className="col-12 col-md-3 mb-2">
    <Form.Select
      value={employeeName}
      onChange={handleUserChange}
      className="w-100"
    >
      {users.map((us) => (
        <option key={us.idNumber} value={us.name}>
          {us.name}
        </option>
      ))}
    </Form.Select>
  </div>

   {/* Fetch Button */}
   <div className="col-12 col-md-2 mb-2">
    <Button
      variant="primary"
      onClick={() => fetchingData()}
      className="w-100"
    >
      Fetch Data
    </Button>
  </div>

  {/* Export Button */}
  {checkAccessComponent("User", "Summary", "Export") && (
    <div className="col-12 col-md-3 mb-2">
      <Button
        variant="dark"
        onClick={exportData}
        disabled={!employees || employees.length === 0}
        className="w-100"
      >
        Export Data
      </Button>
    </div>
  )}
</div>


       {/* Summary Header */}
       <div className="border p-3 mb-4 text-center">
        <h5>Monthly Attendance Sheet</h5>
        <div className="row mt-2">
          <div className="col-6 text-start">Start Date: {startDate}</div>
          <div className="col-6 text-end">End Date: {endDate}</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="table-responsive mt-4">
        <Table bordered hover className="text-center">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Entry Time</th>
              <th>Late Duration</th>
              <th>Entry Comment</th>
              <th>Exit Time</th>
              <th>Time After Exit</th>
              <th>Exit Comment</th>
              <th>Out Time</th>
              <th>Total Time In Day</th>
              <th>Day Comment</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {employees?.length > 0 ? (
              [...employees]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((emp, index) => (
                  <tr key={index}>
                    <td>{emp.date}</td>
                    <td>{emp.entryTime}</td>
                    <td>{emp.lateDuration}</td>
                    <td>{emp.entryComment}</td>
                    <td>{emp.exitTime}</td>
                    <td>{emp.timeAfterExit}</td>
                    <td>{emp.exitComment}</td>
                    <td>{emp.outTime}</td>
                    <td>{emp.totalTimeInDay}</td>
                    <td>{emp.dayComment}</td>
                    <td>{emp.comment}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center text-danger" style={{ verticalAlign: "middle" }}>
                  No attendance data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>

    {/* Loading Modal */}
    <Modal show={loading} backdrop="static" centered>
      <Modal.Body className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Fetching data, please wait...</p>
      </Modal.Body>
    </Modal>
  </>
);
}

export default AttendanceSheet;
