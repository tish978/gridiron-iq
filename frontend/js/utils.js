/**
 * Utility Functions
 * Pure helper functions for scoring, formatting, and calculations
 */

/**
 * Calculate score based on correct answers
 * @param {number} correct - Number of correct answers (0-4)
 * @returns {number} Score from 0-100
 */
export function calculateScore(correct) {
    if (correct < 0 || correct > 4) {
        throw new Error('Correct answers must be between 0 and 4');
    }
    return Math.round((correct / 4) * 100);
}

/**
 * Get professional grade based on score
 * @param {number} score - Score from 0-100
 * @returns {string} Grade label
 */
export function getGrade(score) {
    if (score >= 90) return 'HALL OF FAME';
    if (score >= 75) return 'ALL-PRO';
    if (score >= 60) return 'PRO BOWL';
    if (score >= 40) return 'SOLID STARTER';
    if (score >= 20) return 'PRACTICE SQUAD';
    return 'UNDRAFTED';
}

/**
 * Calculate category-specific scores
 * @param {Array} questions - Array of question objects
 * @param {Array} answers - Array of answer indices (0-3)
 * @returns {Object} Object with history and scheme scores
 */
export function calculateCategoryScores(questions, answers) {
    let historyCorrect = 0;
    let schemeCorrect = 0;
    
    questions.forEach((question, index) => {
        const isCorrect = answers[index] === question.correct;
        
        if (question.type === 'History' && isCorrect) {
            historyCorrect++;
        } else if (question.type === 'Scheme' && isCorrect) {
            schemeCorrect++;
        }
    });
    
    return {
        history: historyCorrect,
        scheme: schemeCorrect,
        historyTotal: questions.filter(q => q.type === 'History').length,
        schemeTotal: questions.filter(q => q.type === 'Scheme').length,
    };
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Format score display text
 * @param {number} score - Score from 0-100
 * @returns {string} Formatted score string
 */
export function formatScore(score) {
    return `Scouter Rating: ${score}/100`;
}

/**
 * Debounce function to limit rapid function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export function isMobile() {
    return window.innerWidth <= 768;
}
