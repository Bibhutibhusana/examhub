import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Statistics = () => {
  const [examResults, setExamResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch users data
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch exam results data
      const examResultsSnapshot = await getDocs(collection(db, 'examResults'));
      const examResultsData = examResultsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(usersData);
      setExamResults(examResultsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    // Total users and active users
    const totalUsers = users.length;
    const activeUsers = users.filter(user => {
      if (!user.lastLogin) return false;
      const lastLogin = user.lastLogin.toDate ? user.lastLogin.toDate() : new Date(user.lastLogin);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastLogin > thirtyDaysAgo;
    }).length;

    if (examResults.length === 0) {
      return {
        totalUsers,
        activeUsers,
        totalExams: 0,
        passRate: 0,
        topScorers: [],
        classDistribution: [],
        scoreRanges: []
      };
    }

    // Combine data
    const combinedData = examResults.map(result => {
      const user = users.find(u => u.id === result.studentId);
      return {
        ...result,
        studentName: user ? user.name : 'Unknown',
        studentEmail: user ? user.email : 'Unknown'
      };
    });

    // Calculate percentages for all results
    const resultsWithPercentage = combinedData.map(result => ({
      ...result,
      percentage: result.totalQuestions > 0 ? (result.score / result.totalQuestions) * 100 : 0
    }));

    // Top 10 scorers
    const topScorers = resultsWithPercentage
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);

    // Total exams taken
    const totalExams = examResults.length;

    // Pass rate (assuming 50% is pass)
    const passedExams = resultsWithPercentage.filter(result => result.percentage >= 50).length;
    const passRate = totalExams > 0 ? ((passedExams / totalExams) * 100).toFixed(1) : 0;

    // Class distribution
    const classCount = {};
    combinedData.forEach(result => {
      const className = result.class || 'Unknown';
      classCount[className] = (classCount[className] || 0) + 1;
    });
    const classDistribution = Object.entries(classCount).map(([name, value]) => ({
      name,
      value
    }));

    // Score ranges
    const scoreRanges = [
      { name: '0-20%', count: 0 },
      { name: '21-40%', count: 0 },
      { name: '41-60%', count: 0 },
      { name: '61-80%', count: 0 },
      { name: '81-100%', count: 0 }
    ];
    resultsWithPercentage.forEach(result => {
      const percentage = result.percentage;
      if (percentage <= 20) scoreRanges[0].count++;
      else if (percentage <= 40) scoreRanges[1].count++;
      else if (percentage <= 60) scoreRanges[2].count++;
      else if (percentage <= 80) scoreRanges[3].count++;
      else scoreRanges[4].count++;
    });

    return {
      totalUsers,
      activeUsers,
      totalExams,
      passRate,
      topScorers,
      classDistribution,
      scoreRanges
    };
  };

  const stats = calculateStats();

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="statistics-container">
      <h3>Exam Statistics</h3>

      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Users</h4>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>

          <div className="stat-card">
            <h4>Active Users (30 days)</h4>
            <div className="stat-value">{stats.activeUsers}</div>
          </div>

          <div className="stat-card">
            <h4>Total Exams Taken</h4>
            <div className="stat-value">{stats.totalExams}</div>
          </div>

          <div className="stat-card">
            <h4>Pass Rate</h4>
            <div className="stat-value">{stats.passRate}%</div>
          </div>

          {/* Charts Section */}
          <div className="stat-card full-width">
            <h4>Class Distribution</h4>
            {stats.classDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.classDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.classDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">No class data available</div>
            )}
          </div>

          <div className="stat-card full-width">
            <h4>Score Distribution</h4>
            {stats.scoreRanges.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.scoreRanges}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">No score data available</div>
            )}
          </div>

          <div className="stat-card full-width">
            <h4>Top 10 Scorers</h4>
            {stats.topScorers.length > 0 ? (
              <div className="top-scorers-list">
                {stats.topScorers.map((scorer, index) => (
                  <div key={index} className="scorer-item">
                    <span className="rank">#{index + 1}</span>
                    <span className="name">{scorer.studentName}</span>
                    <span className="email">({scorer.studentEmail})</span>
                    <span className="score">{scorer.percentage.toFixed(1)}%</span>
                    <span className="details">({scorer.score}/{scorer.totalQuestions})</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No exam results available</div>
            )}
          </div>
        </div>
      ) : (
        <div className="no-data">No statistics available</div>
      )}
    </div>
  );
};

export default Statistics;
