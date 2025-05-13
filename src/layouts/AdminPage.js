import React, { useState, useEffect,useContext } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext
const option = {
  scroll: true,
  backdrop: true,
};

const OffCanvasExample = ({ name, ...props }) => {
  const [show, setShow] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  return (
    <>
      {/* Custom styles */}
     

      {/* Sidebar toggle icon */}
      <Button
        variant="outline-light"
        onClick={toggleShow}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1051,
          border: "none",
          background: "none",
        }}
      >
        <FaBars size={20} color={theme === "dark" ? "#ececf1" : "#000"} />
      </Button>

      {/* Sidebar */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        {...props}
        style={{
          backgroundColor: theme === "dark" ? "#343541" : "#f9f9f9",
          color: theme === "dark" ? "#ececf1" : "#000",
          width: "250px",
        }}
      >
        <Offcanvas.Body className="d-flex flex-column align-items-center text-center">
          <img
            src="/sn.jpg"
            alt="User"
            className="rounded-circle mb-3 mt-5"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              border: `2px solid ${theme === "dark" ? "#ececf1" : "#000"}`,
            }}
          />

          <h5 className="mb-4">User ID: {localStorage.getItem("userId")}</h5>

          <ul className="list-unstyled w-100 px-3">
          <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
              <Link to="/Notice" className="custom-link">Notice</Link>
            </li>
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
              <Link to="/Classes" className="custom-link">Classes</Link>
            </li>
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
              <Link to="/QuizResult" className="custom-link">Quiz Result</Link>
            </li>
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
              <Link to="/ClassFeedback" className="custom-link">Class Feedback</Link>
            </li>
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
              <Link to="/ClassLink" className="custom-link">Class Link</Link>
            </li>
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
              <Link to="/ClassAttendance" className="custom-link">Attendance</Link>
            </li>

            {/* Theme Toggle */}
            <li
              className="custom-list-item text-start py-2 px-3 mb-2 rounded"
              onClick={toggleTheme} // Trigger the toggleTheme function on click
            >
              <span className="d-block">
                {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"} {/* Display text based on current theme */}
              </span>
            </li>
            
        
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
              <a href="/" className="custom-link">Logout</a>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const OffcanvasPage = () => {
  return <OffCanvasExample {...option} />;
};

export default OffcanvasPage;
