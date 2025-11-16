import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Calendar, Award, ArrowLeft, Filter, Download, TrendingDown, TrendingUp as TrendingUpIcon, Trophy, Target, BookOpen, FileText, Star, Zap } from 'lucide-react';
import jsPDF from 'jspdf';

const MyResults = () => {
  const [examHistory, setExamHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState('All');
  const { currentUser, userData, isPremium } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.examHistory) {
      const sorted = userData.examHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setExamHistory(sorted);
      setFilteredHistory(sorted);
    }
    setLoading(false);
  }, [userData]);

  useEffect(() => {
    let filtered = examHistory;

    if (filterSubject !== 'All') {
      filtered = filtered.filter(exam => exam.subject === filterSubject);
    }

    if (filterDateRange !== 'All') {
      const now = new Date();
      const days = filterDateRange === '7' ? 7 : filterDateRange === '30' ? 30 : 90;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(exam => new Date(exam.timestamp.seconds * 1000) >= cutoff);
    }

    setFilteredHistory(filtered);
  }, [examHistory, filterSubject, filterDateRange]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Premium Feature</h1>
            <p className="text-xl text-gray-600 mb-8">
              Detailed performance analytics and exam history are available for premium users only.
            </p>
            <button
              onClick={() => navigate('/paywall')}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 75) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 60) return { level: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getSubjectStats = () => {
    const subjectStats = {};
    examHistory.forEach(exam => {
      const subject = exam.subject || 'General';
      if (!subjectStats[subject]) {
        subjectStats[subject] = { total: 0, scores: [], average: 0 };
      }
      subjectStats[subject].total += 1;
      subjectStats[subject].scores.push(exam.percentage);
      subjectStats[subject].average = subjectStats[subject].scores.reduce((a, b) => a + b, 0) / subjectStats[subject].scores.length;
    });
    return subjectStats;
  };

  const exportToCSV = () => {
    const headers = ['Subject', 'Class', 'Score', 'Total Questions', 'Percentage', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredHistory.map(exam => [
        exam.subject,
        exam.student.class,
        exam.score,
        exam.totalQuestions,
        exam.percentage.toFixed(1),
        new Date(exam.timestamp.seconds * 1000).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'exam_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPerformanceTrend = () => {
    if (examHistory.length < 2) return null;
    const recent = examHistory.slice(0, 5).reverse();
    const avgRecent = recent.reduce((sum, exam) => sum + exam.percentage, 0) / recent.length;
    const avgPrevious = examHistory.length > 5 ?
      examHistory.slice(5, 10).reduce((sum, exam) => sum + exam.percentage, 0) / Math.min(5, examHistory.slice(5).length) :
      avgRecent;
    return avgRecent - avgPrevious;
  };

  const getEarnedBadges = () => {
    const badges = [];
    if (examHistory.length > 0) badges.push({ name: 'First Exam', icon: Trophy, color: 'text-yellow-500', description: 'Completed your first exam' });
    if (examHistory.length >= 10) badges.push({ name: 'Dedicated Learner', icon: Star, color: 'text-blue-500', description: 'Completed 10 exams' });
    if (Math.max(...examHistory.map(e => e.percentage)) >= 90) badges.push({ name: 'Top Performer', icon: Award, color: 'text-green-500', description: 'Achieved 90% or higher' });
    if (examHistory.length >= 5 && examHistory.slice(0, 5).every(e => e.percentage >= 75)) badges.push({ name: 'Consistent Achiever', icon: Target, color: 'text-purple-500', description: 'Scored 75%+ in last 5 exams' });
    return badges;
  };

  const getStudyRecommendations = () => {
    const recommendations = [];
    const subjectStats = getSubjectStats();
    const weakSubjects = Object.entries(subjectStats).filter(([_, stats]) => stats.average < 60);
    const recentTrend = getPerformanceTrend();

    if (weakSubjects.length > 0) {
      recommendations.push({
        type: 'weak_subjects',
        title: 'Focus on Weak Subjects',
        description: `Improve performance in: ${weakSubjects.map(([subject]) => subject).join(', ')}`,
        icon: BookOpen,
        priority: 'high'
      });
    }

    if (recentTrend !== null && recentTrend < -5) {
      recommendations.push({
        type: 'declining_trend',
        title: 'Address Declining Performance',
        description: 'Your recent scores are trending downward. Review study habits and seek help if needed.',
        icon: TrendingDown,
        priority: 'high'
      });
    }

    if (examHistory.length > 0 && examHistory[0].percentage < 70) {
      recommendations.push({
        type: 'recent_performance',
        title: 'Improve Recent Performance',
        description: 'Your latest exam score was below average. Focus on understanding key concepts.',
        icon: Target,
        priority: 'medium'
      });
    }

    return recommendations;
  };

  const getWeakAreas = () => {
    const subjectStats = getSubjectStats();
    return Object.entries(subjectStats)
      .filter(([_, stats]) => stats.average < 70)
      .sort((a, b) => a[1].average - b[1].average)
      .slice(0, 3);
  };

  const getPerformanceInsights = () => {
    const insights = [];
    const subjectStats = getSubjectStats();
    const totalExams = examHistory.length;
    const averageScore = overallAverage;
    const bestScore = Math.max(...examHistory.map(e => e.percentage));
    const trend = getPerformanceTrend();

    insights.push({
      title: 'Overall Performance',
      value: `${averageScore.toFixed(1)}%`,
      description: `Average across ${totalExams} exams`,
      icon: BarChart3,
      color: averageScore >= 75 ? 'text-green-600' : averageScore >= 60 ? 'text-yellow-600' : 'text-red-600'
    });

    insights.push({
      title: 'Best Performance',
      value: `${bestScore.toFixed(1)}%`,
      description: 'Your highest score achieved',
      icon: Trophy,
      color: 'text-blue-600'
    });

    if (trend !== null) {
      insights.push({
        title: 'Performance Trend',
        value: `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`,
        description: 'Change in recent performance',
        icon: trend > 0 ? TrendingUp : TrendingDown,
        color: trend > 0 ? 'text-green-600' : 'text-red-600'
      });
    }

    const consistency = examHistory.length > 1 ?
      100 - (examHistory.reduce((sum, exam, i, arr) => {
        if (i === 0) return 0;
        return sum + Math.abs(exam.percentage - arr[i-1].percentage);
      }, 0) / (examHistory.length - 1)) : 0;

    insights.push({
      title: 'Consistency Score',
      value: `${consistency.toFixed(1)}%`,
      description: 'How consistent your scores are',
      icon: Target,
      color: consistency >= 80 ? 'text-green-600' : consistency >= 60 ? 'text-yellow-600' : 'text-red-600'
    });

    return insights;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.text('Performance Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Overall Stats
    doc.setFontSize(16);
    doc.text('Overall Statistics', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text(`Total Exams: ${examHistory.length}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Average Score: ${overallAverage.toFixed(1)}%`, 20, yPosition);
    yPosition += 10;
    doc.text(`Best Score: ${Math.max(...examHistory.map(e => e.percentage)).toFixed(1)}%`, 20, yPosition);
    yPosition += 20;

    // Subject Performance
    doc.setFontSize(16);
    doc.text('Subject-wise Performance', 20, yPosition);
    yPosition += 15;

    const subjectStats = getSubjectStats();
    Object.entries(subjectStats).forEach(([subject, stats]) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(12);
      doc.text(`${subject}: ${stats.average.toFixed(1)}% (${stats.total} exams)`, 20, yPosition);
      yPosition += 10;
    });

    // Save the PDF
    doc.save('performance_report.pdf');
  };

  const subjectStats = getSubjectStats();
  const overallAverage = examHistory.length > 0 ? examHistory.reduce((sum, exam) => sum + exam.percentage, 0) / examHistory.length : 0;
  const performanceTrend = getPerformanceTrend();
  const uniqueSubjects = ['All', ...new Set(examHistory.map(exam => exam.subject).filter(Boolean))];
  const earnedBadges = getEarnedBadges();
  const recommendations = getStudyRecommendations();
  const weakAreas = getWeakAreas();
  const performanceInsights = getPerformanceInsights();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/student-dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
                <p className="text-gray-600">Detailed performance analytics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{examHistory.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              {performanceTrend !== null ? (
                performanceTrend > 0 ? (
                  <TrendingUpIcon className="w-8 h-8 text-green-500" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-500" />
                )
              ) : (
                <TrendingUp className="w-8 h-8 text-gray-500" />
              )}
              <div>
                <p className="text-sm text-gray-600">Performance Trend</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceTrend !== null ? `${performanceTrend > 0 ? '+' : ''}${performanceTrend.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {examHistory.length > 0 ? Math.max(...examHistory.map(e => e.percentage)).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Recent Exam</p>
                <p className="text-sm font-bold text-gray-900">
                  {examHistory.length > 0 ? new Date(examHistory[0].timestamp.seconds * 1000).toLocaleDateString() : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Trend</h2>
          <div className="h-64 flex items-end justify-center space-x-2">
            {examHistory.slice(0, 10).reverse().map((exam, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-8 bg-purple-500 rounded-t"
                  style={{ height: `${exam.percentage * 2}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2 transform -rotate-45">
                  {new Date(exam.timestamp.seconds * 1000).toLocaleDateString().slice(0, 5)}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center mt-4">Last 10 exams performance</p>
        </div>

        {/* Subject-wise Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Subject-wise Performance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(subjectStats).map(([subject, stats]) => (
              <div key={subject} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{subject}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Exams Taken:</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="font-medium">{stats.average.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${stats.average}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Achievement Badges</h2>
          {earnedBadges.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Complete more exams to earn badges!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {earnedBadges.map((badge, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                  <badge.icon className={`w-12 h-12 mx-auto mb-3 ${badge.color}`} />
                  <h3 className="font-semibold text-gray-900 mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study Recommendations */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Study Recommendations</h2>
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Great job! No specific recommendations at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                  rec.priority === 'high' ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <rec.icon className={`w-6 h-6 mt-1 ${
                      rec.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                      <p className="text-sm text-gray-700">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weak Areas Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Weak Areas Analysis</h2>
          {weakAreas.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Excellent! No weak areas identified.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
              {weakAreas.map(([subject, stats], index) => (
                <div key={index} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{subject}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Score:</span>
                      <span className="font-medium text-red-600">{stats.average.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Exams Taken:</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${stats.average}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Insights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceInsights.map((insight, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                <insight.icon className={`w-8 h-8 mx-auto mb-3 ${insight.color}`} />
                <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</p>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Export */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Subject</label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {uniqueSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date Range</label>
                <select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="All">All Time</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Exam History */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Exam History ({filteredHistory.length} results)</h2>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No exam results match your filters. Try adjusting the filters above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((exam, index) => {
                const performance = getPerformanceLevel(exam.percentage);
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedExam(exam)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${performance.bg}`}>
                          <span className={`text-lg font-bold ${performance.color}`}>
                            {exam.score}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {exam.subject} - Class {exam.student.class}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(exam.timestamp.seconds * 1000).toLocaleDateString()} •
                            {exam.score}/{exam.totalQuestions} correct • {exam.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${performance.bg} ${performance.color}`}>
                          {performance.level}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Exam Detail Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Exam Details</h2>
                <button
                  onClick={() => setSelectedExam(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Subject:</span>
                    <p className="font-medium">{selectedExam.subject}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Class:</span>
                    <p className="font-medium">{selectedExam.student.class}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Score:</span>
                    <p className="font-medium">{selectedExam.score}/{selectedExam.totalQuestions}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <p className="font-medium">{selectedExam.percentage.toFixed(1)}%</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Date:</span>
                  <p className="font-medium">
                    {new Date(selectedExam.timestamp.seconds * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyResults;
