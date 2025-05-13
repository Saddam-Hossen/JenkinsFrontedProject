import React, { useState, useEffect } from 'react';
import { Table, Card, Container, Button, Modal, Form } from 'react-bootstrap';
import { BsChatLeftTextFill } from 'react-icons/bs';
import SingleNavbar from "../layouts/SingleNavbar";
import { getAllQuizFeedbackSingle, saveQuizFeedback } from '../services/QuizSingleFeedbackService';
import moment from 'moment';
import StudentPage from '../layouts/StudentPage';
import '../assets/App.css'; // Adjust the path if needed

const QuizSingleFeedback = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [updatedFeedback, setUpdatedFeedback] = useState({ rating: '', comment: '' });

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getAllQuizFeedbackSingle();
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

  return (
    <>
      <StudentPage />
      <Container className="mt-0 pt-5">
        <Card className="globalDiv shadow-sm p-3 p-md-4">
          <h4 className="mb-4 d-flex align-items-center text-primary fs-5 fs-md-4">
            <BsChatLeftTextFill className="me-2" size={20} />
            Class Feedback
          </h4>

          {notices.length === 0 ? (
            <p className="text-muted text-center">No feedback available at the moment.</p>
          ) : (
            <div className="table-container">
            <Table
               striped
               bordered
               hover
               responsive="sm"
               className="custom-table"
             >
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th style={{ width: '15%' }}>Date & Time</th>
                    <th style={{ width: '15%' }}>Class Name</th>
                    <th style={{ width: '10%' }}>Class No.</th>
                    <th style={{ width: '15%' }}>Trainer</th>
                    <th style={{ width: '10%' }}>Rating</th>
                    <th style={{ width: '20%' }}>Comment</th>
                    <th style={{ width: '10%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice, index) => {
                    const isBeforeClassTime = moment().isBefore(moment(notice.dateTime, "YYYY-MM-DDTHH:mm"));
                    return (
                      <tr key={notice.id || index}>
                        <td>{index + 1}</td>
                        <td>{moment(notice.dateTime, "YYYY-MM-DDTHH:mm").format('YYYY-MM-DD hh:mm A')}</td>
                        <td>{notice.className}</td>
                        <td>{notice.classNumber}</td>
                        <td>{notice.trainerName }</td>
                        <td>{notice.rating || '-'}</td>
                        <td className="text-start">
                          {notice.comment?.split('\n').map((line, idx) => (
                            <React.Fragment key={idx}>
                              {line}
                              <br />
                            </React.Fragment>
                          )) || '-'}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleOpenModal(notice)}
                            disabled={isBeforeClassTime}
                          >
                            Add
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>

      {/* Modal */}
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
            <Button variant="success" onClick={handleUpdateFeedback}>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default QuizSingleFeedback;
