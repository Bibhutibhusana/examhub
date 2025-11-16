import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Trophy, Users, BookOpen } from 'lucide-react';

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examDoc = await getDoc(doc(db, 'exams', id));
        if (examDoc.exists()) {
          const examData = examDoc.data();
          setExam({ id: examDoc.id, ...examData });
        } else {
          setError('Exam not found');
        }
      } catch (err) {
        console.error('Error fetching exam:', err);
        setError('Failed to load exam');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExam();
    }
  }, [id]);

  const handleStartExam = () => {
    // Navigate to the actual exam player
    navigate('/dashboard', { state: { examId: id } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/student-dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Exam Not Found</h2>
          <button
            onClick={() => navigate('/student-dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const examDate = exam.date?.toDate ? exam.date.toDate() : new Date(exam.date);
  const isAvailable = new Date() >= examDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{exam.name}</h1>
          <div className="flex items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{examDate.toLocaleDateString()} at {exam.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={20} />
              <span>{exam.questionsCount} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>Scheduled Exam</span>
            </div>
          </div>
        </div>

        {/* Exam Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Exam Details</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Schedule</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Date:</strong> {examDate.toLocaleDateString()}</p>
                <p><strong>Time:</strong> {exam.time}</p>
                <p><strong>Duration:</strong> {exam.duration || '2 hours'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Requirements</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Questions:</strong> {exam.questionsCount}</p>
                <p><strong>Type:</strong> Multiple Choice</p>
                <p><strong>Passing Score:</strong> {exam.passingScore || '60%'}</p>
              </div>
            </div>
          </div>

          {/* Prizes Section */}
          {exam.prizes && exam.prizes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Winners' Gifts
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {exam.prizes.map((prize, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="text-yellow-600" size={16} />
                      <span className="font-medium text-yellow-800">Rank {index + 1}</span>
                    </div>
                    <p className="text-yellow-700">{prize}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-3">Instructions</h3>
            <ul className="text-blue-800 space-y-2">
              <li>• Make sure you have a stable internet connection</li>
              <li>• Complete all questions within the time limit</li>
              <li>• You can only attempt this exam once</li>
              <li>• Results will be available immediately after submission</li>
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          {isAvailable ? (
            <button
              onClick={handleStartExam}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Exam Now
            </button>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Exam Not Available Yet</h3>
              <p className="text-gray-600">
                This exam will be available on {examDate.toLocaleDateString()} at {exam.time}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeExam;
