import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Trophy, BarChart3, Crown, LogOut, User } from 'lucide-react';
import '../css/StudentDashboard.css';

const StudentDashboard = () => {
  const { currentUser, userData, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [paidExamSets, setPaidExamSets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !currentUser) {
        navigate('/login');
        return;
      }

      // If userData is not available from context, fetch it
      if (!userData) {
        const fetchUserData = async () => {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              // User data will be available through context
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchUserData();
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, isAuthenticated, currentUser, userData, navigate]);

  useEffect(() => {
    const fetchPaidExamSets = async () => {
      if (selectedClass && isPremium) {
        try {
          // Fetch from localStorage
          const keys = Object.keys(localStorage);
          const classKeys = keys.filter(key => key.startsWith(`paidExam_${selectedClass}_set`));
          const sets = classKeys.map(key => {
            const match = key.match(/set(\d+)$/);
            const setNumber = match ? parseInt(match[1]) : 0;
            return {
              setNumber,
              uploadedAt: { seconds: Date.now() / 1000 } // Mock timestamp
            };
          }).sort((a, b) => a.setNumber - b.setNumber);
          setPaidExamSets(sets);
        } catch (error) {
          console.error('Error fetching paid exam sets:', error);
          setPaidExamSets([]);
        }
      } else {
        setPaidExamSets([]);
      }
    };

    fetchPaidExamSets();
  }, [selectedClass, isPremium]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('studentUser');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleTakeExam = () => {
    if (userData?.subscriptionType === 'free' && userData?.examCount >= 10) {
      navigate('/paywall');
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading user data...</p>
        </div>
      </div>
    );
  }

  const freeExamsRemaining = Math.max(0, 10 - (userData.examCount || 0));
  const isPremium = userData.subscriptionType === 'premium';

  return (
    <div className="student-dashboard">
      <div className="dashboard-content">
        {/* Status Card */}
        <div className="status-card">
          {isPremium ? (
            <div className="premium-card">
              <div className="premium-content">
                <div className="premium-icon">
                  <Crown size={24} />
                </div>
                <div className="premium-text">
                  <h2>Premium Member</h2>
                  <p>Enjoy unlimited access to all exams and features!</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="free-card">
              <div className="free-content">
                <div className="free-info">
                  <div className="free-icon">
                    <BookOpen size={24} />
                  </div>
                  <div className="free-text">
                    <h2>Free Exams Remaining</h2>
                    <p>{freeExamsRemaining} out of 10 exams left</p>
                  </div>
                </div>
                <div className="exam-counter">
                  <div className="exam-number">{freeExamsRemaining}</div>
                  <div className="exam-label">exams left</div>
                </div>
              </div>
              {freeExamsRemaining === 0 && (
                <div className="upgrade-notice">
                  <p>You've used all your free exams! Upgrade to Premium for unlimited access.</p>
                  <button onClick={() => navigate('/paywall')} className="upgrade-btn">
                    Upgrade Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="action-grid">
          <div onClick={handleTakeExam} className="action-card">
            <div className="card-content">
              <div className="card-icon">
                <BookOpen size={24} />
              </div>
              <div className="card-text">
                <h3>Take Exam</h3>
                <p>Start a new practice exam</p>
              </div>
            </div>
          </div>

          <div onClick={() => navigate('/my-results')} className="action-card">
            <div className="card-content">
              <div className="card-icon">
                <Trophy size={24} />
              </div>
              <div className="card-text">
                <h3>My Results</h3>
                <p>View past exam results</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => isPremium && navigate('/my-results')}
            className={`action-card ${!isPremium ? 'disabled' : ''}`}
          >
            <div className="card-content">
              <div className="card-icon">
                <BarChart3 size={24} />
              </div>
              <div className="card-text">
                <h3>Analytics</h3>
                <p>Performance insights</p>
              </div>
            </div>
            {!isPremium && <span className="premium-badge">Premium</span>}
          </div>
        </div>

        {/* Paid Exam Section for Premium Users */}
        {isPremium && (
          <div className="paid-exam-section">
            <h2>Paid Exams</h2>
            <div className="class-selector">
              <label htmlFor="classSelect">Select Class:</label>
              <select
                id="classSelect"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Choose a class</option>
                <option value="class3">Class 3</option>
                <option value="class4">Class 4</option>
                <option value="class5">Class 5</option>
                <option value="class6">Class 6</option>
                <option value="class7">Class 7</option>
                <option value="class8">Class 8</option>
                <option value="class9">Class 9</option>
                <option value="class10">Class 10</option>
                <option value="NMMS">NMMS</option>
                <option value="NRTS">NRTS</option>
                <option value="OAV">OAV</option>
                <option value="plus2first">Plus 2 First Year</option>
                <option value="plus2second">Plus 2 Second Year</option>
                <option value="PMST">PMST</option>
              </select>
            </div>
            {selectedClass && (
              <div className="exam-sets">
                <h3>Available Exam Sets for {selectedClass}</h3>
                {paidExamSets.length > 0 ? (
                  <div className="sets-grid">
                    {paidExamSets.map((set) => (
                      <div key={set.setNumber} className="exam-set-card">
                        <h4>Set {set.setNumber}</h4>
                        <p>Uploaded: {new Date(set.uploadedAt.seconds * 1000).toLocaleDateString()}</p>
                        <button
                          onClick={() => navigate(`/exam/${selectedClass}/paid/set${set.setNumber}`)}
                          className="take-exam-btn"
                        >
                          Take Exam
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No exam sets available for this class yet.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Upgrade Banner */}
        {!isPremium && freeExamsRemaining > 0 && (
          <div className="upgrade-banner">
            <div className="banner-content">
              <div className="banner-text">
                <h3>Unlock Unlimited Learning</h3>
                <p>Get access to detailed analytics, unlimited exams, and premium features.</p>
                <ul className="feature-list">
                  <li>Unlimited practice exams</li>
                  <li>Detailed performance analytics</li>
                  <li>Download certificates</li>
                  <li>Priority support</li>
                </ul>
              </div>
              <div className="banner-cta">
                <div className="price">₹199/month</div>
                <button onClick={() => navigate('/paywall')} className="cta-btn">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
