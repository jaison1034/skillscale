import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip,Legend );

const FeedbackDashboard = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  const fetchFeedback = async () => {
    try {
      if (!employeeId.trim()) {
        setError('Please enter a valid employee ID');
        return;
      }

      setLoading(true);
      setError('');
      setFeedbackData(null);
      
      const response = await axios.get(`/api/employee/feedback/${employeeId}`);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setFeedbackData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch feedback');
      console.error('Feedback fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPerformanceBadge = (level) => {
    const badgeStyles = {
      Exceptional: 'bg-purple-100 text-purple-800',
      Strong: 'bg-green-100 text-green-800',
      Developing: 'bg-yellow-100 text-yellow-800',
      'Needs Improvement': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${badgeStyles[level]}`}>
        {level}
      </span>
    );
  };

  const renderSkillChart = () => {
    if (!feedbackData?.detailedAnalysis?.skillMentions) return null;
    
    const skills = Object.keys(feedbackData.detailedAnalysis.skillMentions);
    const mentions = skills.map(skill => feedbackData.detailedAnalysis.skillMentions[skill]);
    
    const data = {
      labels: skills.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1)),
      datasets: [
        {
          label: 'Skill Mentions',
          data: mentions,
          backgroundColor: [
            'rgba(79, 70, 229, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(234, 179, 8, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(217, 70, 239, 0.7)'
          ],
          borderColor: [
            'rgba(79, 70, 229, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(234, 179, 8, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(217, 70, 239, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Skill Mentions in Feedback',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    };
    
    return <Bar data={data} options={options} />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Employee Performance Feedback</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchFeedback}
              disabled={!employeeId || loading}
              className={`px-4 py-2 rounded-md text-white font-medium ${!employeeId || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : 'Generate Feedback'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
      </div>
      
      {feedbackData && (
        <div className="space-y-6">
          {/* Employee Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{feedbackData.employee.name}</h2>
                <p className="text-gray-600">{feedbackData.employee.position}</p>
                <p className="text-sm text-gray-500">{feedbackData.employee.department} Department</p>
              </div>
            </div>
          </div>
          
          {/* Performance Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Performance Summary</h2>
              <div>
                {renderPerformanceBadge(feedbackData.feedback.performanceLevel)}
                <span className="ml-2 text-lg font-semibold">
                  {feedbackData.feedback.overallScore}/100
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000 ease-out"
                  style={{ width: `${feedbackData.feedback.overallScore}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {feedbackData.feedback.feedbackSummary}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Top Strengths</h3>
                <ul className="space-y-1">
                  {feedbackData.feedback.detailedAnalysis.topStrengths.map((strength, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="capitalize">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-800 mb-2">Areas for Improvement</h3>
                <ul className="space-y-1">
                  {feedbackData.feedback.detailedAnalysis.potentialWeaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="capitalize">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'summary' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('development')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'development' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Development Plan
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analysis' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Detailed Analysis
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'summary' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
                <p className="text-gray-700 mb-6">
                  {feedbackData.feedback.feedbackSummary}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Peer Feedback Highlights</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {feedbackData.rawData.peerReviews.length > 0 ? (
                        <ul className="space-y-3">
                          {feedbackData.rawData.peerReviews.slice(0, 3).map((review, i) => (
                            <li key={i} className="border-l-4 border-indigo-200 pl-4 py-1">
                              <p className="text-gray-700 italic">"{review.feedback}"</p>
                              <p className="text-sm text-gray-500 mt-1">
                                — {review.reviewerName}, Score: {review.score}/10
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No peer reviews available</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Manager Feedback</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {feedbackData.rawData.managerReview.review ? (
                        <>
                          <p className="text-gray-700 italic">"{feedbackData.rawData.managerReview.review}"</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Sentiment Score: {feedbackData.rawData.managerReview.sentimentScore.toFixed(1)}/10
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">No manager review available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'development' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personalized Development Plan</h3>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Goals Progress</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                        style={{ 
                          width: `${feedbackData.rawData.managerReview.goalsAssigned > 0 ? 
                            (feedbackData.rawData.managerReview.goalsCompleted / feedbackData.rawData.managerReview.goalsAssigned) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {feedbackData.rawData.managerReview.goalsCompleted || 0}/
                      {feedbackData.rawData.managerReview.goalsAssigned || 0} completed
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Actions</h4>
                  <ul className="space-y-3">
                    {feedbackData.feedback.developmentSuggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-2">Skill Development Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedbackData.feedback.detailedAnalysis.potentialWeaknesses.map((skill, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2 capitalize">Improve {skill}</h5>
                        <ul className="text-sm space-y-1">
                          {getResourcesForSkill(skill).map((resource, j) => (
                            <li key={j} className="text-blue-600 hover:text-blue-800">
                              <a href="#" className="flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                {resource}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'analysis' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Performance Analysis</h3>
                
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 mb-2">Skill Distribution in Feedback</h4>
                  <div className="h-64">
                    {renderSkillChart()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Peer Review Metrics</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Average Score</p>
                          <p className="text-xl font-medium">
                            {feedbackData.feedback.detailedAnalysis.avgPeerScore !== null ? 
                              feedbackData.feedback.detailedAnalysis.avgPeerScore.toFixed(1) : 'N/A'}/10
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Reviews</p>
                          <p className="text-xl font-medium">
                            {feedbackData.feedback.detailedAnalysis.totalFeedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Manager Review Metrics</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Sentiment Score</p>
                          <p className="text-xl font-medium">
                            {feedbackData.feedback.detailedAnalysis.managerSentiment.toFixed(1)}/10
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Goals Completion</p>
                          <p className="text-xl font-medium">
                            {Math.round(
                              (feedbackData.rawData.managerReview.goalsCompleted / 
                              (feedbackData.rawData.managerReview.goalsAssigned || 1)) * 100
                            )}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to return resources based on skill
function getResourcesForSkill(skill) {
  const resources = {
    technical: [
      'Advanced JavaScript Course',
      'System Design Patterns Guide',
      'Clean Code Workshop'
    ],
    communication: [
      'Business Writing Course',
      'Presentation Skills Webinar',
      'Active Listening Techniques'
    ],
    teamwork: [
      'Collaboration Best Practices',
      'Conflict Resolution Guide',
      'Team Dynamics Workshop'
    ],
    leadership: [
      'Leadership Fundamentals Course',
      'Mentoring Junior Developers',
      'Strategic Thinking Seminar'
    ],
    productivity: [
      'Time Management Techniques',
      'Getting Things Done Methodology',
      'Focus and Deep Work Guide'
    ],
    creativity: [
      'Design Thinking Workshop',
      'Innovation Strategies',
      'Problem Solving Techniques'
    ]
  };
  
  return resources[skill] || ['General professional development resources'];
}

export default FeedbackDashboard;