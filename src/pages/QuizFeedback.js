import React, { useState, useEffect } from 'react';
import { Table, Card, Container, Button, Modal, Form } from 'react-bootstrap';
import { BsChatLeftTextFill } from 'react-icons/bs';
import SingleNavbar from "../layouts/SingleNavbar";
import { getAllQuizFeedback, saveQuizFeedback } from '../services/QuizSingleFeedbackService';
import moment from 'moment';
import AdminPage from '../layouts/AdminPage';
import '../assets/App.css';
import * as XLSX from 'xlsx';

const QuizSingleFeedback = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [updatedFeedback, setUpdatedFeedback] = useState({ rating: '', comment: '' });
  const [selectedClassName, setSelectedClassName] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getAllQuizFeedback();
        data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setNotices(data);
      } catch (err) {
        console.error("❌ Error fetching quiz feedback:", err);
      }
    };
    fetchNotices();
  }, []);

  const handleOpenModal = (feedback) => {
    setSelectedFeedback(feedback);
    setUpdatedFeedback({
      rating: feedback.rating || '',
      comment: feedback.comment || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
    setUpdatedFeedback({ rating: '', comment: '' });
  };

  const handleUpdateFeedback = async () => {
    try {
      if (!selectedFeedback) return;
      const updatedData = {
        feedbackId: selectedFeedback.id,
        className: selectedFeedback.className,
        classNumber: selectedFeedback.classNumber,
        trainerName: selectedFeedback.trainerName,
        ...updatedFeedback
      };
      await saveQuizFeedback(updatedData);
      window.location.reload();
      handleCloseModal();
    } catch (err) {
      console.error("❌ Error updating feedback:", err);
    }
  };

  const uniqueClassNames = [...new Set(notices.map(cls => cls.className))];
  const filteredClasses = selectedClassName
    ? notices.filter(cls => cls.className === selectedClassName)
    : notices;

  const handleExport = () => {
    const dataToExport = filteredClasses.map(({ idNumber, className, classNumber, trainerName, rating, comment }) => ({
      'ID No.': idNumber,
      'Class Name': className,
      'Class No.': classNumber,
      'Trainer': trainerName,
      'Rating': rating,
      'Comment': comment,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');
    XLSX.writeFile(workbook, `quiz_feedback_${selectedClassName || 'all'}.xlsx`);
  };

  // Group by className + classNumber + trainerName
  const groupedData = [];
  const groupMap = new Map();

  filteredClasses.forEach((item) => {

    const key = `${item.className}_${item.classNumber}_${item.trainerName}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key).push(item);
  });

  groupMap.forEach((group, key) => {
    groupedData.push({ key, rows: group });
  });

  return (
    <>
      <AdminPage />
      <Container className="mt-0 pt-5">
        <Card className="globalDiv shadow-sm p-3 p-md-4">
          <h4 className="mb-4 d-flex align-items-center text-primary fs-5 fs-md-4">
            <BsChatLeftTextFill className="me-2" size={20} />
            Class Feedback
          </h4>

          <div className="globalDiv d-flex flex-column flex-md-row align-items-stretch gap-3 mb-3" style={{ width: '100%' }}>
            <Form.Select
              value={selectedClassName}
              onChange={(e) => setSelectedClassName(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">All Classes</option>
              {uniqueClassNames.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </Form.Select>
            <Button variant="success" onClick={handleExport}>Export</Button>
          </div>

          {filteredClasses.length === 0 ? (
            <p className="text-muted text-center">No feedback available at the moment.</p>
          ) : (
            <div className="table-container">
              <Table striped bordered hover responsive="sm" className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    
                    <th style={{ width: '15%' }}>Class Name</th>
                    <th style={{ width: '10%' }}>Class No.</th>
                     <th style={{ width: '15%' }}>Trainer</th>
                    <th style={{ width: '15%' }}>ID No.</th>
                   
                    <th style={{ width: '10%' }}>Rating</th>
                    <th style={{ width: '35%' }}>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData.map((group, groupIndex) => {
                    return group.rows.map((notice, rowIndex) => (
                      <tr key={notice.id || `${group.key}_${rowIndex}`}>
                        <td>{groupIndex + rowIndex + 1}</td>
                       
                        {rowIndex === 0 && (
                          <>
                            <td rowSpan={group.rows.length}  style={{ textAlign: 'center', verticalAlign: 'middle' }}>{notice.className}</td>
                            <td rowSpan={group.rows.length}  style={{ textAlign: 'center', verticalAlign: 'middle' }}>{notice.classNumber}</td>
                            <td rowSpan={group.rows.length}  style={{ textAlign: 'center', verticalAlign: 'middle' }}>{notice.trainerName}</td>

                          </>
                        )}
                        {rowIndex !== 0 && null}
                         <td>{notice.idNumber}</td>
                        <td>{notice.rating}</td>
                        <td className="text-start">
                          {notice.comment?.split('\n').map((line, idx) => (
                            <React.Fragment key={idx}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>

      {/* Modal for editing feedback */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                placeholder="Enter rating (1-5)"
                value={updatedFeedback.rating}
                onChange={(e) => setUpdatedFeedback({ ...updatedFeedback, rating: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter comment"
                value={updatedFeedback.comment}
                onChange={(e) => setUpdatedFeedback({ ...updatedFeedback, comment: e.target.value })}
              />
            </Form.Group>
            <Button variant="success" onClick={handleUpdateFeedback}>Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default QuizSingleFeedback;
