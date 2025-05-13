import React, { useState, useEffect } from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import Navbar from "../layouts/SingleNavbar";
import { getAllQuizlinks } from '../services/QuizlinkService';
import StudentPage from '../layouts/StudentPage';
import '../assets/App.css'; // Adjust the path if needed
const QuizSinglelink = () => {
  const [quizlinks, setQuizlinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllQuizlinks();
        setQuizlinks(result);
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
            🔗 Class Video Links Dashboard
          </h4>

          {quizlinks.length === 0 ? (
            <p className="text-muted text-center">No class Video links added yet.</p>
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
                    <th>Class Video Link</th>
                  </tr>
                </thead>
                <tbody>
                  {quizlinks.map((quizlink, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                      <td>{quizlink.className}</td>
                      <td>{quizlink.classNumber}</td>
                      <td>
                        <a href={quizlink.link} target="_blank" rel="noopener noreferrer">
                          View Class
                        </a>
                      </td>
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

export default QuizSinglelink;
