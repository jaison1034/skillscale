const vader = require("vader-sentiment");

const analyzeReview = (text) => {
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    return Math.round((intensity.compound + 1) * 5); 
};

module.exports = analyzeReview;

