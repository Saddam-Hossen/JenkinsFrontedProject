import React, { useState, useEffect, useRef } from "react";
import { Table, Form, Button, Modal, Spinner } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { getAttendanceData,exportDownloadAllAttendanceData } from "../services/attendanceDataService";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";

const AttendanceSheet = () => {
  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const latestRequestRef = useRef(0);

  useEffect(() => {
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      console.log("Invalid date range, skipping fetch.");
      return;
    }

    let requestId = ++latestRequestRef.current;
    setLoading(true); // Start loading

    const fetchData = async () => {
      try {
        const response = await getAttendanceData(startDate, endDate);
        if (requestId === latestRequestRef.current) {
        
          setEmployees(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

 
 // Export Data
 const exportData = async () => {
  setLoading(true);
  const success =  await exportDownloadAllAttendanceData(employees);
  setLoading(false);

  if (success) {
    alert("Exported successfully to Download directory");
  } else {
    alert("Export failed. Please check your internet or try again later.");
  }
};

const fetchingData = async () => {
  if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
    console.log("Invalid date range, skipping fetch.");
    return;
  } 
  let requestId = ++latestRequestRef.current;
  setLoading(true); // Start loading

  const fetchData = async () => {
    try {
      const response = await getAttendanceData(startDate, endDate);
      if (requestId === latestRequestRef.current) {
      
        setEmployees(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  fetchData();
}


return (
  <>
   <Navbar />
  <div className="container mt-4" style={{ paddingTop: "100px" }}>
    {/* Date Filters - Stacked on Mobile */}
    <div className="row align-items-center mb-3">
  {/* Start Date */}
  <div className="col-12 col-md-3 mb-2">
    <Form.Control
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
  </div>

  {/* End Date */}
  <div className="col-12 col-md-3 mb-2">
    <Form.Control
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </div>

  {/* Fetch Button */}
  <div className="col-12 col-md-3 mb-2">
    <Button 
      variant="primary" 
      onClick={() => fetchingData()} 
      className="w-100"
    >
      Fetch Data
    </Button>
  </div>

  {/* Export Button */}
  {checkAccessComponent("Download", "DownloadAllEmployeeAttendanceData", "exportData") && (
    <div className="col-12 col-md-3 mb-2">
      <Button 
        variant="dark" 
        className="w-100" 
        onClick={exportData}
      >
        Export Data
      </Button>
    </div>
  )}
</div>


      {/* Title and Date Summary */}
      <div className="border p-3 mb-4 text-center">
        <h5>At A Glance Attendance Sheet</h5>
        <div className="row mt-2">
          <div className="col-6 text-start">
            <small>Start Date: {startDate}</small>
          </div>
          <div className="col-6 text-end">
            <small>End Date: {endDate}</small>
          </div>
        </div>
      </div>

     

      {/* Attendance Table - Scrollable on Mobile */}
      <div className="table-responsive mt-4">
        <Table bordered hover className="text-center table-sm">
          <thead className="table-light">
            <tr>
              <th>Serial</th>
              <th>Name</th>
              <th>Office Days</th>
              <th>Total Present</th>
              <th>Avg Time</th>
              <th>Leave</th>
              <th>Absent</th>
              <th>Holiday</th>
              <th>Short Time</th>
              <th>Required Time</th>
              <th>Extra Time</th>
              <th>Entry In Time</th>
              <th>Entry Late</th>
              <th>Entry Total Late</th>
              <th>Exit OK</th>
              <th>Exit Early</th>
              <th>Total Extra Time</th>
              <th>Office Out Time</th>
              <th>Office In Time</th>
              <th>Total Time</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.serial}>
                  <td>{emp.serial}</td>
                  <td>{emp.name}</td>
                  <td>{emp.officeDay}</td>
                  <td>{emp.totalPresent}</td>
                  <td>{emp.avgTime}</td>
                  <td>{emp.leave}</td>
                  <td>{emp.absent}</td>
                  <td>{emp.holyday}</td>
                  <td>{emp.shortTime}</td>
                  <td>{emp.requiredTime}</td>
                  <td>{emp.extraTime}</td>
                  <td>{emp.entryInTime}</td>
                  <td>{emp.entryLate}</td>
                  <td>{emp.entryTotalLate}</td>
                  <td>{emp.exitOk}</td>
                  <td>{emp.exitEarly}</td>
                  <td>{emp.totalExtraTime}</td>
                  <td>{emp.officeOutTime}</td>
                  <td>{emp.officeInTime}</td>
                  <td>{emp.totalTime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="20" className="text-center text-danger">
                  No attendance data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>

    {/* Loading Spinner */}
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
