/**
 * UI Component Builders
 * Functions for rendering and updating UI elements
 */

/**
 * Show loading spinner
 */
export function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
    }
}

/**
 * Hide loading spinner
 */
export function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
    }
}

/**
 * Show landing screen
 */
export function showLandingScreen() {
    document.getElementById('landing-screen')?.classList.remove('hidden');
    document.getElementById('question-screen')?.classList.add('hidden');
    document.getElementById('results-screen')?.classList.add('hidden');
}

/**
 * Show question screen
 */
export function showQuestionScreen() {
    document.getElementById('landing-screen')?.classList.add('hidden');
    document.getElementById('question-screen')?.classList.remove('hidden');
    document.getElementById('results-screen')?.classList.add('hidden');
}

/**
 * Show results screen
 */
export function showResultsScreen() {
    document.getElementById('landing-screen')?.classList.add('hidden');
    document.getElementById('question-screen')?.classList.add('hidden');
    document.getElementById('results-screen')?.classList.remove('hidden');
}

/**
 * Update progress bar
 * @param {number} current - Current question number (1-based)
 * @param {number} total - Total questions
 */
export function updateProgress(current, total) {
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    
    if (progressText) {
        progressText.textContent = `Question ${current} of ${total}`;
    }
    
    if (progressBar) {
        const percentage = (current / total) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

/**
 * Update category badge
 * @param {string} category - Category name (History or Scheme)
 */
export function updateCategoryBadge(category) {
    const badge = document.getElementById('category-badge');
    if (badge) {
        badge.textContent = category;
    }
}

/**
 * Display question and answers
 * @param {Object} question - Question object
 */
export function displayQuestion(question) {
    const questionText = document.getElementById('question-text');
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    if (questionText) {
        questionText.textContent = question.q;
    }
    
    answerButtons.forEach((button, index) => {
        const answerText = button.querySelector('.answer-text');
        if (answerText && question.a[index]) {
            answerText.textContent = question.a[index];
        }
        
        // Reset button state
        button.classList.remove('selected', 'correct', 'incorrect', 'disabled');
        button.disabled = false;
    });
    
    // Update category badge
    updateCategoryBadge(question.type);
}

/**
 * Show feedback for answer
 * @param {boolean} isCorrect - Whether answer was correct
 * @param {Object} question - Question object
 * @param {number} selectedIndex - Selected answer index
 */
export function showFeedback(isCorrect, question, selectedIndex) {
    const feedbackCard = document.getElementById('feedback-card');
    const feedbackHeader = document.getElementById('feedback-header');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    if (!feedbackCard || !feedbackHeader || !feedbackExplanation) return;
    
    // Disable all answer buttons
    answerButtons.forEach(btn => {
        btn.classList.add('disabled');
        btn.disabled = true;
    });
    
    // Highlight correct answer
    const correctButton = answerButtons[question.correct];
    if (correctButton) {
        correctButton.classList.add('correct');
    }
    
    // Highlight incorrect answer if wrong
    if (!isCorrect && selectedIndex !== undefined) {
        const incorrectButton = answerButtons[selectedIndex];
        if (incorrectButton) {
            incorrectButton.classList.add('incorrect', 'shake');
        }
    }
    
    // Set feedback content
    if (isCorrect) {
        feedbackHeader.textContent = 'TOUCHDOWN';
        feedbackHeader.className = 'text-4xl font-black italic mb-4 text-center neu-text-primary';
        feedbackCard.classList.add('feedback-touchdown');
        feedbackCard.classList.remove('feedback-intercepted');
        feedbackCard.classList.add('flash-green');
    } else {
        feedbackHeader.textContent = 'INTERCEPTED';
        feedbackHeader.className = 'text-4xl font-black italic mb-4 text-center neu-text-primary';
        feedbackCard.classList.add('feedback-intercepted');
        feedbackCard.classList.remove('feedback-touchdown');
        feedbackCard.classList.add('flash-red');
    }
    
    feedbackExplanation.textContent = question.expl;
    feedbackCard.classList.remove('hidden');
}

/**
 * Hide feedback card
 */
export function hideFeedback() {
    const feedbackCard = document.getElementById('feedback-card');
    if (feedbackCard) {
        feedbackCard.classList.add('hidden');
        feedbackCard.classList.remove('flash-green', 'flash-red');
    }
}

/**
 * Display results screen
 * @param {Object} results - Results object with score, grade, and breakdown
 */
export function displayResults(results) {
    const gradeDisplay = document.getElementById('grade-display');
    const scoreDisplay = document.getElementById('score-display');
    const historyScore = document.getElementById('history-score');
    const schemeScore = document.getElementById('scheme-score');
    
    if (gradeDisplay) {
        gradeDisplay.textContent = results.grade;
    }
    
    if (scoreDisplay) {
        scoreDisplay.textContent = results.scoreText;
    }
    
    if (historyScore) {
        const history = (results.history !== undefined) ? results.history : 0;
        const historyTotal = (results.historyTotal !== undefined) ? results.historyTotal : 0;
        historyScore.textContent = `${history}/${historyTotal}`;
    }
    
    if (schemeScore) {
        const scheme = (results.scheme !== undefined) ? results.scheme : 0;
        const schemeTotal = (results.schemeTotal !== undefined) ? results.schemeTotal : 0;
        schemeScore.textContent = `${scheme}/${schemeTotal}`;
    }
    
    showResultsScreen();
}
