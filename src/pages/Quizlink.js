import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Navbar from "../layouts/Navbar";
import { saveQuizlink, getAllQuizlinks, deleteQuizlinkById } from '../services/QuizlinkService';
import {getAllQuizNotices,getAllEmployees} from '../services/QuizClassesService';
import { FaTrash } from 'react-icons/fa'; // Import the Trash icon
import AdminPage from '../layouts/AdminPage';
import '../assets/App.css'; // Adjust the path if needed
const Quizlink = () => {
    const[totalClasses, setTotaClasses] = useState([]);
    const [show, setShow] = useState(false);
    const [quizlinks, setQuizlinks] = useState([]);
    const [formData, setFormData] = useState({
        className: '',
        classNumber: '',
        link: ''
    });

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await saveQuizlink(formData);
            const updatedQuizlinks = await getAllQuizlinks();
            setQuizlinks(updatedQuizlinks);

            setFormData({
                className: '',
                classNumber: '',
                link: ''
            });
            handleClose();
        } catch (error) {
            console.error("Failed to save quizlink:", error);
            alert("Something went wrong while saving.");
        }
    };

    const handleDelete = async (idd) => {
        try {
            await deleteQuizlinkById({ id: idd });
            const updatedQuizlinks = await getAllQuizlinks();
            setQuizlinks(updatedQuizlinks);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllQuizlinks();
                setQuizlinks(result);
                setTotaClasses(await getAllQuizNotices()); // Fetch quiz notices
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <AdminPage />
            <div className="container mt-0" style={{ paddingTop: "30px" }}>
             <div
                className="globalDiv d-flex flex-column flex-md-row align-items-stretch gap-3 mb-3"
                style={{ width: '100%' }}
                >
                <Button variant="primary" onClick={handleShow} style={{ marginBottom: "20px" }}>Add Class Video Link</Button>
                </div>
                {/* Modal */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title> Class Video link Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                             <Form.Group className="mb-3">
                                <Form.Label>Class Name</Form.Label>
                                <Form.Select
                                    name="className"
                                    value={formData.className}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Select Class Name --</option>
                                    {totalClasses.map((cls, index) => (
                                        <option key={index} value={cls.className}>
                                            {cls.className}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                             <Form.Group className="mb-3">
                                <Form.Label>Class Number</Form.Label>
                                <Form.Select
                                    name="classNumber"
                                    value={formData.classNumber}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Select Class Number --</option>
                                    {totalClasses.map((cls, index) => (
                                        <option key={index} value={cls.classNumber}>
                                            {cls.classNumber}
                                        </option>
                                    ))}
                                </Form.Select>
                                </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="link"
                                    value={formData.link}
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
                            <th>Class Name</th>
                            <th>Class Number</th>
                            <th>Class Video Link</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizlinks.length > 0 ? (
                            quizlinks.map((quizlink, index) => (
                                <tr key={index}>
                                    <td>{quizlink.className}</td>
                                    <td>{quizlink.classNumber}</td>
                                    <td>{quizlink.link}</td>
                                    <td>
                                        <Button  variant="outline-danger"
                                            size="sm"
                                            style={{
                                                borderColor: 'transparent',
                                                boxShadow: 'none'
                                            }} onClick={() => handleDelete(quizlink.id)}> <FaTrash /> {/* Render Trash Icon */}</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No class links added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                </div>
            </div>
        </>
    );
};

export default Quizlink;
