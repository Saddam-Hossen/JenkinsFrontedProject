import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { saveClass, getAllClasses, deleteClassRecord } from '../services/QuizResultService';
import { getAllQuizNotices, getAllEmployees } from '../services/QuizClassesService';
import { FaTrash } from 'react-icons/fa';
import AdminPage from '../layouts/AdminPage';
import * as XLSX from 'xlsx';
import '../assets/App.css';

const QuizResult = () => {
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [students, setStudents] = useState([]);
    const [totalClasses, setTotalClasses] = useState([]);
    const [show, setShow] = useState(false);
    const [classes, setClasses] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [selectedClassName, setSelectedClassName] = useState('');
    const [selectedClassNumber, setSelectedClassNumber] = useState('');

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setExcelData([]);
        setFileName('');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllClasses();
                setClasses(result);
                setTotalClasses(await getAllQuizNotices());
                setStudents(await getAllEmployees());
            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            const requiredFields = [ 'idNumber', 'totalMarks', 'obtainMarks', 'merit'];
            const errorDetails = [];

            jsonData.forEach((row, index) => {
                requiredFields.forEach(field => {
                    if (row[field] === undefined || row[field] === '') {
                        errorDetails.push(`Row ${index + 2} is missing: ${field}`);
                    }
                });
            });

            if (errorDetails.length > 0) {
                setErrorMessage(['Required fields are missing:', ...errorDetails].join('\n'));
                setShowErrorModal(true);
                setExcelData([]);
                return;
            }
       
            setExcelData(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleSaveAll = async () => {
        try {
            for (const record of excelData) {
               // console.log('Excel Data:', record);
               
                record.className = selectedClassName;
                record.classNumber = selectedClassNumber;
                 //console.log('Excel Data modified:', record);
                await saveClass(record);
            }
            const updatedClasses = await getAllClasses();
            setClasses(updatedClasses);
            handleClose();
        } catch (error) {
            console.error('Error saving Excel data:', error);
            alert('Failed to save data.');
        }
    };

    const handleDelete = async (idd) => {
        try {
            await deleteClassRecord({ id: idd });
            const updatedClasses = await getAllClasses();
            setClasses(updatedClasses);
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const uniqueClassNames = [...new Set(classes.map(cls => cls.className))];
    const filteredClasses = selectedClassName
        ? classes.filter(cls => cls.className === selectedClassName)
        : classes;


        const handleExport = () => {
            const dataToExport = filteredClasses.map(({ className, classNumber, idNumber, totalMarks, obtainMarks, merit }) => ({
                className,
                classNumber,
                idNumber,
                totalMarks,
                obtainMarks,
                merit
            }));
        
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
        
            XLSX.writeFile(workbook, 'quiz_results.xlsx');
        };
        
const filteredClassNumbers = totalClasses
    .filter(cls => cls.className === selectedClassName)
    .map(cls => cls.classNumber);

const groupedData = [];
  const groupMap = new Map();

  filteredClasses.forEach((item) => {

    const key = `${item.className}_${item.classNumber}`;
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
            <div className="container mt-0" style={{ paddingTop: '30px' }}>
               <div
                 className="globalDiv d-flex flex-column flex-md-row align-items-stretch gap-3 mb-3"
                style={{ width: '100%' }}
                >
                <Button variant="primary" onClick={handleShow}>Import</Button>

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

            

                <Modal show={show} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Excel Result</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                       
                        <Form.Group controlId="classNameSelect" className="mb-3">
                            <Form.Label>Select Class Name</Form.Label>
                            <Form.Select
                                value={selectedClassName}
                                onChange={(e) => setSelectedClassName(e.target.value)}
                                style={{ flex: 1 }}
                            >
                                <option value="">Select Class Name</option>
                                {uniqueClassNames.map((name, idx) => (
                                    <option key={idx} value={name}>{name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="classNumberSelect" className="mb-3">
                          <Form.Label>Select Class Name</Form.Label>
                          <Form.Select
                            onChange={(e) => setSelectedClassNumber(e.target.value)}
                            style={{ flex: 1 }} 
                         >
                            <option value="">Select Class Number</option>
                            {filteredClassNumbers.map((number, idx) => (
                                <option key={idx} value={number}>{number}</option>
                            ))}
                        </Form.Select>
                        </Form.Group>


                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Select Excel File</Form.Label>
                            <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                            {fileName && <div className="mt-2">Selected File: <strong>{fileName}</strong></div>}
                        </Form.Group>

                        {excelData.length > 0 && (
                            <Table striped bordered hover size="sm" responsive>
                                <thead>
                                    <tr>
                                        {Object.keys(excelData[0]).map((key, i) => (
                                            <th key={i}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {excelData.map((row, idx) => (
                                        <tr key={idx}>
                                            {Object.values(row).map((val, i) => (
                                                <td key={i}>{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        {excelData.length > 0 && <Button variant="success" onClick={handleSaveAll}>Save All</Button>}
                    </Modal.Footer>
                </Modal>

                <div className="table-container mt-4">
                    <Table striped bordered hover responsive="sm" className="custom-table">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Class Name</th>
                                <th>Class Number</th>
                                <th>Student ID</th>
                                <th>Total Marks</th>
                                <th>Obtained Marks</th>
                                <th>Merit</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                       <tbody>
                            {filteredClasses.length > 0 ? (
                                groupedData.map((group, groupIndex) =>
                                group.rows.map((notice, rowIndex) => (
                                    <tr key={notice.id || `${group.key}_${rowIndex}`}>
                                    <td>{groupIndex + rowIndex + 1}</td>

                                    {rowIndex === 0 && (
                                        <>
                                        <td rowSpan={group.rows.length} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {notice.className}
                                        </td>
                                        <td rowSpan={group.rows.length} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {notice.classNumber}
                                        </td>
                                        </>
                                    )}

                                    <td>{notice.idNumber}</td>
                                    <td>{notice.totalMarks}</td>
                                    <td>{notice.obtainMarks}</td>
                                    <td>{notice.merit}</td>
                                    <td>
                                        <Button
                                        variant="outline-danger"
                                        size="sm"
                                        style={{ borderColor: 'transparent', boxShadow: 'none' }}
                                        onClick={() => handleDelete(notice.id)}
                                        >
                                        <FaTrash />
                                        </Button>
                                    </td>
                                    </tr>
                                ))
                                )
                            ) : (
                                <tr>
                                <td colSpan="7" className="text-center">
                                    No results available.
                                </td>
                                </tr>
                            )}
                            </tbody>

                    </Table>
                </div>
            </div>

            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Invalid Excel File</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ color: 'black' }}>
                    {(() => {
                        const lines = errorMessage.split('\n');
                        const firstLine = lines[0];
                        const otherLines = lines.slice(1);
                        return (
                            <>
                                <p style={{ fontWeight: 'bold', color: 'red' }}>{firstLine}</p>
                                <p style={{ fontWeight: 'bold' }}>Column Name should be: idNumber, totalMarks, obtainMarks, merit.</p>
                                <p style={{ fontWeight: 'bold' }}>Please check the following:</p>
                                <p style={{ fontWeight: 'bold' }}>Details:</p>
                                <ol>
                                    {otherLines.map((msg, idx) => (
                                        <li key={idx}>
                                            {msg.split('\n').map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                        </li>
                                    ))}
                                </ol>
                            </>
                        );
                    })()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowErrorModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default QuizResult;
