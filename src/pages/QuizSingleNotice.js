import React, { useState, useEffect } from 'react';
import { Table, Card, Container } from 'react-bootstrap';
import SingleNavbar from "../layouts/SingleNavbar";
import { getAllQuizNotices } from '../services/QuizNoticeService';
import moment from 'moment';
import StudentPage from '../layouts/StudentPage';
import '../assets/App.css'; // Adjust the path if needed
import { BsBellFill, BsChevronDown, BsChevronUp } from 'react-icons/bs';

// Helper function to render clickable links and preserve line breaks
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
  const [notices, setNotices] = useState([]);
  const [expandedNotices, setExpandedNotices] = useState({});

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

  const toggleExpanded = (index) => {
    setExpandedNotices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <>
      <StudentPage />
      <Container className="mt-0 pt-5">
        <Card className=" globalDiv shadow-sm p-3 p-md-4">
          <h4 className="mb-4 d-flex align-items-center text-primary fs-5 fs-md-4">
            <BsBellFill className="me-2" size={20} />
            Notice Dashboard
          </h4>

          {notices.length === 0 ? (
            <p className="text-muted text-center">No notices available at the moment.</p>
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
                    <th style={{ width: '10%' }}>#</th>
                    <th style={{ width: '20%' }}>Notification Name</th>
                    <th style={{ width: '10%' }}>Date & Time</th>
                    <th style={{ width: '60%' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {notices
                    .filter(notice => notice.status === "Active")
                    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
                    .map((notice, index) => {
                      const allLines = renderTextWithLinks(notice.text);
                      const isExpanded = expandedNotices[index];
                      const visibleLines = isExpanded ? allLines : allLines.slice(0, 2);

                      return (
                        <tr key={notice.id || index}>
                          <td>{index + 1}</td>
                          <td>{notice.name}</td>
                          <td>{new Date(notice.datetime).toLocaleString()}</td>
                          <td className="text-start" style={{ whiteSpace: 'pre-wrap' }}>
                            {visibleLines}
                            {allLines.length > 2 && (
                              <span
                                onClick={() => toggleExpanded(index)}
                                style={{
                                  color: '#007bff',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginTop: '4px',
                                  fontWeight: '500'
                                }}
                              >
                                {isExpanded ? (
                                  <>
                                    <BsChevronUp className="me-1" /> Read Less
                                  </>
                                ) : (
                                  <>
                                    <BsChevronDown className="me-1" /> Read More
                                  </>
                                )}
                              </span>
                            )}

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
    </>
  );
};

export default QuizNotice;
