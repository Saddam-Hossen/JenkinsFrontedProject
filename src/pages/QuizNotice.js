import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Navbar from "../layouts/Navbar";
import AdminPage from '../layouts/AdminPage';
import { saveQuizNotice, getAllQuizNotices, updateQuizNoticeStatus, deleteQuizNotice } from '../services/QuizNoticeService';
import { FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import '../assets/App.css';

// Helper to render links and preserve line breaks
const renderTextWithLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const segments = line.split(urlRegex).map((part, i) => {
      if (urlRegex.test(part)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });

    return (
      <React.Fragment key={lineIdx}>
        {segments}
        <br />
      </React.Fragment>
    );
  });
};

const QuizNotice = () => {
  const [show, setShow] = useState(false);
  const [notices, setNotices] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [expandedStates, setExpandedStates] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    datetime: '',
    text: '',
    status: 'Active'
  });

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setFormData({ name: '', datetime: '', text: '', status: 'Active' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await saveQuizNotice(formData);
      setNotices(prev => [...prev, response]);
      handleClose();
    } catch (err) {
      alert("❌ Failed to save quiz notice.");
    }
  };

  const toggleExpanded = (index) => {
   
    setExpandedStates(prev => ({ ...prev, [index]: !prev[index] }));
    
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getAllQuizNotices();
        data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
        setNotices(data);
      } catch (err) {
        console.error("❌ Error fetching quiz notices:", err);
      }
    };
    fetchNotices();
  }, []);

  return (
    <>
      <AdminPage />
      <div className="container mt-0" style={{ paddingTop: "30px" }}>
       
       <div
          className="globalDiv d-flex flex-column flex-md-row align-items-stretch gap-3 mb-3"
          style={{ width: '100%' }}
        >       
        <Button variant="primary" onClick={handleShow}>Add Notice</Button>
        </div>

        {/* Modal for Adding Notice */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Notice Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="notificationName">
                <Form.Label>Notification Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter notification name"
                />
              </Form.Group>

              <Form.Group controlId="notificationDatetime" className="mt-3">
                <Form.Label>Notification DateTime</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="datetime"
                  value={formData.datetime}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="notificationText" className="mt-3">
                <Form.Label>Notification Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="status" className="mt-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="success" onClick={handleSubmit}>Save Notice</Button>
          </Modal.Footer>
        </Modal>

        {/* Notice Table */}
        <div className="table-container mt-4">
          <Table striped bordered hover responsive="sm" >
            <thead >
              <tr>
                <th >#</th>
                <th >Notification Name</th>
                <th >Notification DateTime</th>
                <th >Notification Text</th>
                <th >Status</th>
                <th >Action</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice, index) => {
                const lines = notice.text.split('\n');
                const isExpanded = expandedStates[index];
                const visibleLines = isExpanded ? lines : lines.slice(0, 2);

                return (
                  <tr key={notice.id || index}>
                    <td >{index + 1}</td>
                    <td >{notice.name}</td>
                    <td >{new Date(notice.datetime).toLocaleString()}</td>
                    <td className="text-start" style={{ whiteSpace: 'pre-wrap' }}>
                      {visibleLines.map((line, idx) => (
                        <div key={idx}>{renderTextWithLinks(line)}</div>
                      ))}
                      {lines.length > 2 && (
                       <span
                       onClick={() => toggleExpanded(index)}
                       style={{
                         color: '#007bff',
                         textDecoration: 'underline',
                         cursor: 'pointer',
                         display: 'inline-flex',
                         alignItems: 'center',
                         gap: '5px',
                         marginTop: '4px',
                         fontWeight: '500'
                       }}
                     >
                       <span className="icon-wrapper">
                         {isExpanded ? <BsChevronUp /> : <BsChevronDown />}
                       </span>
                       <span className="translate-text">
                         {isExpanded ? 'Read Less' : 'Read More'}
                       </span>
                     </span>
                     
                      )}
                    </td>
                    <td >
                      {notice.status}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={async () => {
                          const newStatus = notice.status === "Active" ? "Inactive" : "Active";
                          try {
                            const updatedNotice = await updateQuizNoticeStatus(notice.id, newStatus);
                            setNotices(notices.map(n => n.id === notice.id ? updatedNotice : n));
                          } catch (err) {
                            alert("❌ Failed to update status");
                          }
                        }}
                      >
                        {notice.status === "Active" ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                      </Button>
                    </td>
                    <td >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        style={{ borderColor: 'transparent', boxShadow: 'none' }}
                        onClick={() => {
                          setSelectedNoticeId(notice.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this quiz notice?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={async () => {
              try {
                await deleteQuizNotice(selectedNoticeId);
                setNotices(notices.filter(n => n.id !== selectedNoticeId));
                setShowDeleteModal(false);
              } catch (err) {
                alert("❌ Failed to delete notice");
              }
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QuizNotice;
