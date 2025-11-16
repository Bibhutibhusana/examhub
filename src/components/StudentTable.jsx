import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch students data
      const studentsSnapshot = await getDocs(collection(db, 'students'));
      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch exam results data
      const examResultsSnapshot = await getDocs(collection(db, 'examResults'));
      const examResultsData = examResultsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));



      setStudents(studentsData);
      setExamResults(examResultsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Combine student and exam result data
  const combinedData = examResults.map(result => {
    const student = students.find(s => s.id === result.studentId);
    return {
      ...result,
      studentName: student ? student.name : 'Unknown',
      studentClass: student ? student.class : 'Unknown',
      studentAddress: student ? student.address : 'Unknown',
      examDate: result.submittedAt ? new Date(result.submittedAt.toDate()).toLocaleDateString() : 'Unknown',
      examType: result.class || 'Unknown'
    };
  });

  // Pagination logic
  const totalPages = Math.ceil(combinedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = combinedData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="loading">Loading student data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="student-table-container">
      <h3>Student Exam Results</h3>
      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Class</th>
              <th>Exam Type</th>
              <th>Address</th>
              <th>Marks</th>
              <th>Total Questions</th>
              <th>Percentage</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((result, index) => (
                <tr key={startIndex + index}>
                  <td>{result.studentName}</td>
                  <td>{result.studentClass}</td>
                  <td>{result.examType}</td>
                  <td>{result.studentAddress}</td>
                  <td>{result.score || 0}</td>
                  <td>{result.totalQuestions || 0}</td>
                  <td>
                    {result.totalQuestions > 0
                      ? `${((result.score / result.totalQuestions) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </td>
                  <td>{result.examDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">No exam results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
