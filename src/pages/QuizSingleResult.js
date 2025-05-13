import React, { useState, useEffect } from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import Navbar from "../layouts/SingleNavbar";
import { getAllClassesSingle } from '../services/QuizResultService';
import StudentPage from '../layouts/StudentPage';
import '../assets/App.css'; // Adjust the path if needed
const QuizSingleResult = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllClassesSingle();
        result.sort((a, b) => new Date(b.classNumber) - new Date(a.classNumber));
        setClasses(result);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <StudentPage />
      <Container className="mt-0 pt-5">
        <Card className=" globalDiv shadow-sm p-3 p-md-4">
          <h4 className="mb-4 text-primary text-center text-md-start">
            📊 Quiz Results Summary
          </h4>

          {classes.length === 0 ? (
            <p className="text-muted text-center">No result added yet.</p>
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
                    <th>#</th>
                    <th>Class Name</th>
                    <th>Class Number</th>
                    <th>Total Marks</th>
                    <th>Obtained Marks</th>
                    <th>Merit</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{cls.className}</td>
                      <td>{cls.classNumber}</td>
                      <td>{cls.totalMarks || '-'}</td>
                      <td>{cls.obtainMarks || '-'}</td>
                      <td>{cls.merit || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>
    </>
  );
};

export default QuizSingleResult;
