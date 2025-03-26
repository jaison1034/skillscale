// src/config.js

const config = {
    // API Configuration
    API: {
      BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
      ENDPOINTS: {
        ALL_FEEDBACK: '/api/reviews/all-feedback',
        EMPLOYEE_FEEDBACK: (employeeId) => `/api/reviews/employee-feedback/${employeeId}`,
        TIMEOUT: 10000, // 10 seconds
      },
      HEADERS: {
        COMMON: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    },
  
    // Sentiment Score Thresholds
    SENTIMENT_THRESHOLDS: {
      EXCELLENT: 1.5,
      GOOD: 0.5,
      NEUTRAL: -0.5,
      POOR: -1.5,
    },
  
    // UI Configuration
    UI: {
      MAX_SUGGESTIONS: 5,
      MAX_STRENGTHS: 3,
      MAX_IMPROVEMENTS: 3,
      ITEMS_PER_PAGE: 9, // For future pagination
    },
  
    // Color Themes
    COLORS: {
      SENTIMENT: {
        EXCELLENT: 'bg-green-100 text-green-800',
        GOOD: 'bg-blue-100 text-blue-800',
        NEUTRAL: 'bg-yellow-100 text-yellow-800',
        POOR: 'bg-orange-100 text-orange-800',
        VERY_POOR: 'bg-red-100 text-red-800',
        DEFAULT: 'bg-gray-100 text-gray-800',
      },
      BADGES: {
        STRENGTH: 'bg-green-100 text-green-800',
        IMPROVEMENT: 'bg-yellow-100 text-yellow-800',
        SUGGESTION: 'bg-blue-100 text-blue-800',
      },
    },
  
    // Default Messages
    MESSAGES: {
      LOADING: 'Analyzing performance data...',
      NO_DATA: 'No employee feedback has been collected yet.',
      ERRORS: {
        DEFAULT: 'Failed to load feedback data. Please try again later.',
        SERVER: 'Server error, please try again later',
        TIMEOUT: 'Request timed out. Please check your connection.',
      },
    },
  };
  
  export default config;