import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Navbar from "../layouts/Navbar";
import { saveQuizNotice, getAllQuizNotices, deleteQuizClasses } from '../services/QuizClassesService';
import { FaTrash } from 'react-icons/fa'; // Import the Trash icon
import AdminPage from '../layouts/AdminPage';
import * as XLSX from 'xlsx';

const QuizClasses = () => {
    const [show, setShow] = useState(false);
    const [notices, setNotices] = useState([]);
    const [formData, setFormData] = useState({
        datetime: '',
        className: '',
        classNumber: '',
        trainerName: ''
    });

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
          
            await saveQuizNotice(formData); // save to backend

            const updatedNotices = await getAllQuizNotices(); // refresh list from DB
            setNotices(updatedNotices);

            setFormData({
                datetime: '',
                className: '',
                classNumber: '',
                trainerName: ''
            });
            handleClose();
            window.location.reload(); // Refresh the page to reflect changes
        } catch (error) {
            console.error("Failed to save notice:", error);
            alert("Something went wrong while saving.");
        }
    };

    const handleDelete = async (idd) => {
        try {
            await deleteQuizClasses({ id: idd });
            const updatedNotices = await getAllQuizNotices();
            setNotices(updatedNotices);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllQuizNotices();
                // Sort the notices by datetime in descending order
                result.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
                setNotices(result);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        fetchData();
    }, []);

    // Format date for the modal in Asia/Dhaka timezone
    const formatDatetime = (datetime) => {
        const options = {
           
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const date = new Date(datetime);
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };
    const handleExport = () => {
        if (notices.length === 0) {
          alert("No data to export.");
          return;
        }
      
        const dataToExport = notices.map(({ className, classNumber, trainerName, datetime }) => ({
          Class_Name: className,
          Class_Number: classNumber,
          Trainer_Name: trainerName,
          Class_Date_Time: new Date(datetime).toLocaleString()
        }));
      
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Quiz Classes');
      
        XLSX.writeFile(workbook, 'quiz_classes_export.xlsx');
      };
      
    return (
        <>
            <AdminPage />
            <div className="container mt-0" style={{ paddingTop: "30px" }}>
            <div
            className="globalDiv d-flex flex-column flex-md-row align-items-stretch gap-3 mb-3"
            style={{ width: '100%' }}
            >
               <Button variant="primary" onClick={handleShow} >
                Add Class
                </Button>

                 <Button variant="success" onClick={handleExport} >Export</Button>
            </div>

                {/* Modal */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Class information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Date & Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="datetime"
                                    value={formData.datetime}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Class Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="className"
                                    value={formData.className}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Class Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="classNumber"
                                    value={formData.classNumber}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Trainer Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="trainerName"
                                    value={formData.trainerName}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit}>Save</Button>
                    </Modal.Footer>
                </Modal>

                {/* Table */}
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
                            <th>Date & Time</th>
                            <th>Class Name</th>
                            <th>Class Number</th>
                            <th>Trainer Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.length > 0 ? (
                            notices.map((notice, index) => (
                                <tr key={index}>
                                    {/* Show datetime in Asia/Dhaka timezone */}
                                    <td>{new Date(notice.datetime).toLocaleString()}</td>
                                    <td>{notice.className}</td>
                                    <td>{notice.classNumber}</td>
                                    <td>{notice.trainerName}</td>
                                    <td>
                                        <Button  variant="outline-danger"
                                            size="sm"
                                            style={{
                                                borderColor: 'transparent',
                                                boxShadow: 'none'
                                            }} onClick={() => handleDelete(notice.id)}> <FaTrash /> {/* Render Trash Icon */}</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No class added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                </div>
            </div>
        </>
    );
};

export default QuizClasses;
