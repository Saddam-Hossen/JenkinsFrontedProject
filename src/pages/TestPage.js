import React, { useState, useEffect } from "react";
import { Button, Offcanvas, Container, Row, Col, Card } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
const option = {
  scroll: true,
  backdrop: true,
};

const OffCanvasExample = ({ name, ...props }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  return (
    <>
      {/* Inline style for the custom list hover effect */}
      <style>{`
        .custom-list-item {
          background-color: transparent;
          color: #ececf1;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .custom-list-item:hover {
          background-color: #565869;
        }
      `}</style>

      {/* Toggle icon at top-left */}
      <Button
        variant="outline-light"
        onClick={toggleShow}
        style={{
            position: "fixed",  // ✅ Now fixed, so it stays visible on scroll
          top: "20px",
          left: "20px",
          zIndex: 1051,
          border: "none",
          background: "none",
        }}
      >
        <FaBars size={20} color="#ececf1" />
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        {...props}
        style={{ backgroundColor: "#343541", color: "#ececf1",

        width: "250px", // Set a fixed width for the Offcanvas
         }}
      >
        {/* Removed Offcanvas.Header to hide the X icon */}
        <Offcanvas.Body className="d-flex flex-column align-items-center text-center">
          {/* Profile Image */}
          <img
            src="/sn.jpg"
            alt="User"
            className="rounded-circle mb-3 mt-5"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              border: "2px solid #ececf1",
            }}
          />

          {/* User ID */}
          <h5 className="mb-4" style={{ color: "#ececf1" }}>
            User ID: user123
          </h5>

            {/* Clickable List with Links */}
            <ul className="list-unstyled w-100 px-3">
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
                <a href="/QuizNotice" className="text-decoration-none text-reset d-block">Notice</a>
            </li>
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
                <a href="/QuizAttendance" className="text-decoration-none text-reset d-block">Attendance</a>
            </li>
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
                <a href="/QuizFeedback" className="text-decoration-none text-reset d-block">Feedback</a>
            </li>
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
                <a href="/QuizResult" className="text-decoration-none text-reset d-block">Quiz Result</a>
            </li>
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
                <a href="/Quizlink" className="text-decoration-none text-reset d-block">Class Link</a>
            </li>
            <li className="custom-list-item text-start py-2 px-3 mb-2 rounded">
                <a href="/logout" className="text-decoration-none text-reset d-block">Logout</a>
            </li>
            </ul>


        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const OffcanvasPage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#343541";
    document.body.style.color = "#ececf1";
    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.color = null;
    };
  }, []);

  return (
    <>
      <OffCanvasExample {...option} />
    </>
  );
};

export default OffcanvasPage;
