const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Employee = require("../models/Employee");
const natural = require("natural");
const compromise = require("compromise");
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = natural;

// NLP Tools
const tokenizer = new WordTokenizer();
const stemmer = PorterStemmer;
const analyzer = new SentimentAnalyzer("English", stemmer, "afinn");

// Performance Categories with Weights
const PERFORMANCE_CATEGORIES = {
    communication: {
        positivePatterns: [
            /clear (communication|explanation|speaker)/i,
            /effective (listener|presenter|communicator)/i,
            /articulate(s|d)? (ideas|thoughts|points)/i,
            /(excellent|strong|exceptional) (verbal|written|interpersonal) (skills|ability)/i,
            /(conveys|explains) complex (ideas|concepts) (clearly|effectively)/i,
            /active listener/i,
            /(responds|replies) (promptly|clearly)/i
        ],
        negativePatterns: [
            /(difficult|hard|challenging) to understand/i,
            /(poor|weak|limited) (listening|presentation|communication) (skills|ability)/i,
            /(unclear|confusing|vague) (explanation|communication|message)/i,
            /(rarely|seldom) (shares|expresses) (ideas|thoughts)/i,
            /(fails|struggles) to (articulate|express) (ideas|thoughts)/i,
            /(avoids|ignores) (questions|discussions)/i
        ],
        positiveFeedback: "Demonstrates excellent communication skills.",
        negativeFeedback: "Needs improvement in communication.",
        improvementSuggestions: [
            "Attend communication workshops",
            "Practice summarizing key points",
            "Seek feedback on written communications"
        ],
        weight: 4
    },
    teamwork: {
        positivePatterns: [
            /team (player|collaborator|worker)/i,
            /supports (colleagues|teammates|peers)/i,
            /(shares|mentors|provides) (knowledge|skills|expertise)/i,
            /(fosters|promotes) collaborative (environment|culture)/i,
            /(values|respects) others' (opinions|ideas)/i,
            /(helps|assists) (teammates|colleagues) (willingly|regularly)/i
        ],
        negativePatterns: [
            /(reluctant|resistant|hesitant) to (collaborate|share|help)/i,
            /(rarely|seldom|infrequently) (shares|offers) (ideas|knowledge|assistance)/i,
            /(works|operates) (primarily|mostly) independently/i,
            /(dismisses|ignores) others' (input|suggestions)/i,
            /(creates|causes) team (conflict|tension)/i
        ],
        positiveFeedback: "Works well in team settings.",
        negativeFeedback: "Should engage more in team collaborations.",
        improvementSuggestions: [
            "Join cross-functional projects",
            "Initiate knowledge-sharing sessions",
            "Practice active listening"
        ],
        weight: 3
    },
    technical: {
        positivePatterns: [
            /(strong|excellent|exceptional) technical (skills|knowledge|expertise)/i,
            /(quick|effective|efficient) (problem solver|troubleshooter)/i,
            /(mastery|command) of (relevant|required) (technologies|tools)/i,
            /(innovative|creative) technical (solutions|approaches)/i,
            /(learns|adapts) new (technologies|skills) (quickly|effectively)/i
        ],
        negativePatterns: [
            /(limited|basic|inadequate) technical (skills|knowledge)/i,
            /(struggles|difficulty|challenges) with (complex|advanced) (problems|tasks|concepts)/i,
            /(slow|reluctant) to (learn|adopt) new (technologies|methods)/i,
            /(outdated|obsolete) technical (knowledge|skills)/i,
            /(requires|needs) frequent (assistance|guidance) with technical (tasks|issues)/i
        ],
        positiveFeedback: "Strong technical expertise.",
        negativeFeedback: "Needs to strengthen technical knowledge.",
        improvementSuggestions: [
            "Complete technical certifications",
            "Participate in coding sessions",
            "Set up peer programming"
        ],
        weight: 5
    },
    productivity: {
        positivePatterns: [
            /(highly|extremely|exceptionally) (productive|efficient)/i,
            /(consistently|reliably) (meets|exceeds) (deadlines|expectations)/i,
            /(excellent|strong) time (management|utilization)/i,
            /(handles|manages) multiple (tasks|projects) (effectively|efficiently)/i,
            /(prioritizes|organizes) work (effectively|well)/i
        ],
        negativePatterns: [
            /(misses|delays|extends) (deadlines|deliverables)/i,
            /(low|reduced|inconsistent) (output|productivity)/i,
            /(poor|weak) time (management|estimation)/i,
            /(easily|frequently) (distracted|side-tracked)/i,
            /(struggles|difficulty) with (prioritization|multitasking)/i
        ],
        positiveFeedback: "Maintains high productivity.",
        negativeFeedback: "Needs to improve time management.",
        improvementSuggestions: [
            "Use time-blocking techniques",
            "Adopt project management tools",
            "Break tasks into milestones"
        ],
        weight: 3
    }
};

// Analyze feedback text
function analyzeText(text) {
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const sentimentScore = analyzer.getSentiment(tokens);
    const doc = compromise(text);
    const nouns = doc.nouns().out('array');
    const adjectives = doc.adjectives().out('array');
    return { sentimentScore, nouns, adjectives };
}

async function generateEmployeeFeedback(employeeId) {
    try {
        // Fetch peer reviews
        const peerReviews = await Review.find({ reviewedId: employeeId });

        // Fetch manager review from the Employee document
        const employee = await Employee.findById(employeeId);
        const managerReview = employee?.review
            ? {
                  feedback: employee.review,
                  score: employee.sentimentScore || 5,
              }
            : null;

        // Combine all reviews (peer + manager)
        const allReviews = managerReview ? [...peerReviews, managerReview] : [...peerReviews];

        // If no reviews exist, return default feedback
        if (allReviews.length === 0) {
            return {
                score: 0,
                maxScore: 15,
                strengths: ["No feedback available"],
                improvementAreas: ["No feedback available"],
                suggestions: ["Collect more feedback"],
                peerReviewCount: peerReviews.length,
                hasManagerReview: !!managerReview,
            };
        }

        // Initialize scoring variables
        let categoryScores = {};
        let categoryCounts = {};
        let totalScore = 0;

        Object.keys(PERFORMANCE_CATEGORIES).forEach((category) => {
            categoryScores[category] = 0;
            categoryCounts[category] = 0;
        });

        // Debugging: Log all reviews being processed
        console.log(`Processing feedback for Employee ID: ${employeeId}`);
        console.log("Reviews found:", allReviews);

        // Process each review and score it
        allReviews.forEach((review) => {
            const text = review.feedback.toLowerCase();
            console.log(`🔍 Analyzing Review: "${text}"`);

            Object.keys(PERFORMANCE_CATEGORIES).forEach((category) => {
                const { positivePatterns, negativePatterns, weight } = PERFORMANCE_CATEGORIES[category];

                // Match patterns
                const positiveMatches = positivePatterns.filter((p) => text.match(p)).length;
                const negativeMatches = negativePatterns.filter((p) => text.match(p)).length;

                console.log(
                    `📌 Category: ${category} | Positives: ${positiveMatches}, Negatives: ${negativeMatches}`
                );

                // If matches are found, adjust scores
                if (positiveMatches > 0 || negativeMatches > 0) {
                    categoryCounts[category]++;
                    const impact = (positiveMatches - negativeMatches) * (weight / 10);
                    categoryScores[category] += impact;
                }
            });
        });

        console.log("Category Scores (Before Normalization):", categoryScores);
        console.log("Category Counts:", categoryCounts);

        // Normalize scores
        Object.keys(PERFORMANCE_CATEGORIES).forEach((category) => {
            if (categoryCounts[category] > 0) {
                categoryScores[category] = Math.max(
                    0,
                    Math.min(
                        PERFORMANCE_CATEGORIES[category].weight,
                        categoryScores[category] / categoryCounts[category]
                    )
                );
            }
            totalScore += categoryScores[category];
        });

        totalScore = Math.min(15, Math.round(totalScore));
        console.log(`✅ Final Score for Employee ${employeeId}: ${totalScore}`);

        // Generate strengths, improvement areas, and suggestions
        let strengths = [];
        let improvements = [];
        let suggestions = new Set();

        Object.entries(categoryScores).forEach(([category, score]) => {
            const categoryData = PERFORMANCE_CATEGORIES[category];
            const percentage = score / categoryData.weight;

            if (percentage > 0.7) {
                strengths.push(categoryData.positiveFeedback);
                if (Math.random() > 0.5) {
                    suggestions.add(`Continue ${categoryData.improvementSuggestions[0].toLowerCase()}`);
                }
            } else if (percentage < 0.4) {
                improvements.push(categoryData.negativeFeedback);
                categoryData.improvementSuggestions.forEach((s) => suggestions.add(s));
            }
        });

        // Fallback defaults
        if (strengths.length === 0) {
            strengths.push(totalScore > 8 ? "Generally positive feedback" : "Some positive aspects noted");
        }
        if (improvements.length === 0 && totalScore < 7) {
            improvements.push("Could benefit from general performance improvement");
        }
        if (suggestions.size === 0) {
            suggestions.add(totalScore > 8 ? "Continue current development" : "Consider additional training");
        }

        return {
            score: totalScore,
            maxScore: 15,
            strengths: strengths.slice(0, 3),
            improvementAreas: improvements.slice(0, 3),
            suggestions: Array.from(suggestions).slice(0, 5),
            peerReviewCount: peerReviews.length,
            hasManagerReview: !!managerReview,
            managerReview: managerReview?.feedback || "No manager review",
            peerReviews: peerReviews.map((r) => ({
                feedback: r.feedback,
                score: r.score,
            })),
        };
    } catch (error) {
        console.error("❌ Feedback generation error:", error);
        throw error;
    }
}


router.get("/all-feedback", async (req, res) => {
    console.log("Fetching all feedback..."); // Add this
    try {
        const employees = await Employee.find().lean();
        const allFeedback = await Promise.all(
            employees.map(async employee => {
                const feedback = await generateEmployeeFeedback(employee._id);
                return {
                    employeeId: employee._id,
                    name: employee.name,
                    department: employee.department,
                    position: employee.position,
                    ...feedback
                };
            })
        );
        res.status(200).json(allFeedback);
    } catch (error) {
        console.error("Error getting all feedback:", error);
        res.status(500).json({ 
            error: "Internal server error", 
            message: error.message 
        });
    }
});

// Get feedback for single employee
router.get("/:employeeId", async (req, res) => {
    try {
        const feedback = await generateEmployeeFeedback(req.params.employeeId);
        res.status(200).json(feedback);
    } catch (error) {
        console.error("Error getting employee feedback:", error);
        res.status(500).json({ 
            error: "Internal server error", 
            message: error.message 
        });
    }
});

module.exports = router;