const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const natural = require('natural');
const { SentimentAnalyzer, PorterStemmer } = natural;
const Employee = require('../models/Employee');
const Review = require('../models/review');

// Initialize sentiment analyzer
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

// Skill categories with related keywords
const SKILL_CATEGORIES = {
  technical: ['code', 'technical', 'programming', 'debug', 'algorithm', 'system'],
  communication: ['communicate', 'presentation', 'explain', 'articulate', 'listen', 'email'],
  teamwork: ['team', 'collaborate', 'support', 'help', 'peer', 'colleague'],
  leadership: ['lead', 'mentor', 'guide', 'direct', 'manage', 'supervise'],
  productivity: ['efficient', 'productive', 'deadline', 'deliver', 'timely', 'punctual'],
  creativity: ['innovate', 'creative', 'solution', 'idea', 'approach', 'design']
};

router.get('/feedback/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: 'Invalid employee ID format' });
    }
    
    const [employee, peerReviews] = await Promise.all([
      Employee.findById(employeeId).select('name position department review sentimentScore goalsAssigned goalsCompleted'),
      Review.find({ reviewedId: employeeId }).select('feedback score reviewerId reviewerName createdAt')
    ]);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Analyze reviews
    const analysis = analyzeReviews(peerReviews, employee.review);
    
    // Generate personalized feedback
    const feedback = generateFeedback(employee, analysis);
    
    res.json({
      employee: {
        name: employee.name,
        position: employee.position,
        department: employee.department
      },
      feedback,
      rawData: {
        peerReviews,
        managerReview: {
          review: employee.review,
          sentimentScore: employee.sentimentScore,
          goalsAssigned: employee.goalsAssigned,
          goalsCompleted: employee.goalsCompleted
        }
      }
    });
    
  } catch (error) {
    console.error('Feedback generation error:', error);
    res.status(500).json({ error: 'Server error during feedback generation' });
  }
});

function analyzeReviews(peerReviews, managerReview) {
  const validPeerReviews = peerReviews.filter(review => 
    review && review.feedback && typeof review.score === 'number'
  );
  
  // Calculate average scores
  const peerScores = validPeerReviews.map(r => r.score);
  const avgPeerScore = peerScores.length > 0 ? 
    peerScores.reduce((sum, score) => sum + score, 0) / peerScores.length : null;
  
  // Analyze sentiment of manager review
  let managerSentiment = 0;
  if (managerReview) {
    managerSentiment = analyzer.getSentiment(managerReview.split(' '));
  }
  
  // Extract skill mentions
  const skillMentions = {};
  const allFeedback = [
    ...validPeerReviews.map(r => r.feedback),
    managerReview
  ].filter(Boolean);
  
  Object.keys(SKILL_CATEGORIES).forEach(skill => {
    skillMentions[skill] = 0;
    const keywords = SKILL_CATEGORIES[skill];
    
    allFeedback.forEach(text => {
      keywords.forEach(keyword => {
        if (text.toLowerCase().includes(keyword)) {
          skillMentions[skill]++;
        }
      });
    });
  });
  
  // Identify top strengths and weaknesses
  const sortedSkills = Object.entries(skillMentions)
    .sort((a, b) => b[1] - a[1]);
    
  const topStrengths = sortedSkills.slice(0, 2).map(([skill]) => skill);
  const potentialWeaknesses = sortedSkills.slice(-2).map(([skill]) => skill);
  
  return {
    avgPeerScore,
    managerSentiment,
    skillMentions,
    topStrengths,
    potentialWeaknesses,
    totalFeedback: allFeedback.length
  };
}

function generateFeedback(employee, analysis) {
  const { avgPeerScore, managerSentiment, topStrengths, potentialWeaknesses } = analysis;
  const goalsCompletion = employee.goalsAssigned > 0 ? 
    employee.goalsCompleted / employee.goalsAssigned : 0;
  
  // Calculate overall performance score (0-100)
  const peerScoreContribution = avgPeerScore !== null ? avgPeerScore * 0.6 : 50;
  const managerScoreContribution = managerSentiment * 10 * 0.3;
  const goalsContribution = goalsCompletion * 100 * 0.1;
  const overallScore = Math.min(100, Math.round(
    peerScoreContribution + managerScoreContribution + goalsContribution
  ));
  
  // Generate feedback based on score range
  let performanceLevel, feedbackSummary;
  
  if (overallScore >= 85) {
    performanceLevel = 'Exceptional';
    feedbackSummary = `${employee.name} demonstrates outstanding performance across all key areas. `;
  } else if (overallScore >= 70) {
    performanceLevel = 'Strong';
    feedbackSummary = `${employee.name} performs well with notable strengths in several areas. `;
  } else if (overallScore >= 55) {
    performanceLevel = 'Developing';
    feedbackSummary = `${employee.name} meets expectations in many areas with opportunities for growth. `;
  } else {
    performanceLevel = 'Needs Improvement';
    feedbackSummary = `${employee.name} requires significant development in key performance areas. `;
  }
  
  // Add strengths and weaknesses to feedback
  if (topStrengths.length > 0) {
    feedbackSummary += `Key strengths include ${formatList(topStrengths)}. `;
  }
  
  if (potentialWeaknesses.length > 0) {
    feedbackSummary += `Areas needing attention are ${formatList(potentialWeaknesses)}. `;
  }
  
  // Add goals completion info
  feedbackSummary += `Completed ${Math.round(goalsCompletion * 100)}% of assigned goals.`;
  
  // Generate development suggestions
  const developmentSuggestions = generateSuggestions(
    performanceLevel, 
    topStrengths, 
    potentialWeaknesses,
    goalsCompletion
  );
  
  return {
    performanceLevel,
    overallScore,
    feedbackSummary,
    developmentSuggestions,
    detailedAnalysis: analysis
  };
}

function generateSuggestions(level, strengths, weaknesses, goalsCompletion) {
  const suggestions = [];
  
  // Base suggestions based on performance level
  if (level === 'Exceptional') {
    suggestions.push(
      'Consider taking on leadership roles in cross-functional projects',
      'Mentor junior team members to develop leadership skills',
      'Document and share best practices with the wider team'
    );
  } else if (level === 'Strong') {
    suggestions.push(
      'Identify 1-2 areas to develop into expert-level competencies',
      'Seek stretch assignments to expand skill set',
      'Participate in knowledge-sharing sessions'
    );
  } else if (level === 'Developing') {
    suggestions.push(
      'Create a focused development plan with manager',
      'Request additional training in key areas',
      'Find a mentor to guide professional growth'
    );
  } else {
    suggestions.push(
      'Establish weekly check-ins with manager',
      'Complete targeted training in critical skill gaps',
      'Break down goals into smaller, achievable milestones'
    );
  }
  
  // Add strength-specific suggestions
  strengths.forEach(strength => {
    if (strength === 'technical') {
      suggestions.push('Lead a technical brown bag session to share knowledge');
    } else if (strength === 'communication') {
      suggestions.push('Volunteer to present at team meetings or company events');
    }
  });
  
  // Add weakness-specific suggestions
  weaknesses.forEach(weakness => {
    if (weakness === 'technical') {
      suggestions.push('Complete advanced technical training courses');
    } else if (weakness === 'communication') {
      suggestions.push('Practice clear, concise writing with peer reviews');
    }
  });
  
  // Add goals-related suggestions
  if (goalsCompletion < 0.7) {
    suggestions.push(
      'Break down large goals into smaller, manageable tasks',
      'Use time management techniques like Pomodoro or time blocking'
    );
  }
  
  return suggestions.slice(0, 5); // Return top 5 most relevant suggestions
}

function formatList(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

module.exports = router;