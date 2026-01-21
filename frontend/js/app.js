/**
 * Main Game Controller
 * Manages game state and flow
 */

import { getQuestions } from './api.js';
import { calculateScore, getGrade, calculateCategoryScores, formatScore } from './utils.js';
import { 
    showLoading, 
    hideLoading, 
    showLandingScreen, 
    showQuestionScreen, 
    showResultsScreen,
    updateProgress, 
    displayQuestion, 
    showFeedback, 
    hideFeedback,
    displayResults 
} from './components.js';

/**
 * GridironGame - Main game controller class
 */
class GridironGame {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.score = 0;
        this.isAnswerSelected = false;
        
        this.initializeEventListeners();
    }
    
    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Start button
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
        
        // Answer buttons
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.selectAnswer(index);
            });
        });
        
        // Next button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        // Restart button
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restart());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    /**
     * Start new game
     */
    async startGame() {
        try {
            showLoading();
            this.questions = await getQuestions(4);
            this.currentQuestionIndex = 0;
            this.answers = [];
            this.score = 0;
            this.isAnswerSelected = false;
            
            hideLoading();
            showQuestionScreen();
            this.displayCurrentQuestion();
        } catch (error) {
            hideLoading();
            alert(error.message || 'Failed to start game. Please try again.');
            console.error('Error starting game:', error);
        }
    }
    
    /**
     * Display current question
     */
    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        displayQuestion(question);
        updateProgress(this.currentQuestionIndex + 1, this.questions.length);
        hideFeedback();
        this.isAnswerSelected = false;
    }
    
    /**
     * Handle answer selection
     * @param {number} index - Selected answer index (0-3)
     */
    selectAnswer(index) {
        if (this.isAnswerSelected) return;
        
        this.isAnswerSelected = true;
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = index === question.correct;
        
        // Store answer
        this.answers.push(index);
        
        // Show feedback
        showFeedback(isCorrect, question, index);
    }
    
    /**
     * Move to next question
     */
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
        } else {
            this.displayCurrentQuestion();
        }
    }
    
    /**
     * End game and show results
     */
    endGame() {
        // Calculate scores
        const correctCount = this.questions.reduce((count, q, i) => {
            return count + (this.answers[i] === q.correct ? 1 : 0);
        }, 0);
        
        this.score = calculateScore(correctCount);
        const grade = getGrade(this.score);
        const categoryScores = calculateCategoryScores(this.questions, this.answers);
        
        // Ensure all properties exist
        const results = {
            grade,
            scoreText: formatScore(this.score),
            history: categoryScores.history || 0,
            scheme: categoryScores.scheme || 0,
            historyTotal: categoryScores.historyTotal || 0,
            schemeTotal: categoryScores.schemeTotal || 0,
        };
        
        // Display results
        displayResults(results);
    }
    
    /**
     * Restart game - immediately start a new game
     */
    async restart() {
        // Reset game state
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.score = 0;
        this.isAnswerSelected = false;
        
        // Immediately start a new game (don't go back to landing)
        try {
            showLoading();
            this.questions = await getQuestions(4);
            this.currentQuestionIndex = 0;
            this.answers = [];
            this.score = 0;
            this.isAnswerSelected = false;
            
            hideLoading();
            showQuestionScreen();
            this.displayCurrentQuestion();
        } catch (error) {
            hideLoading();
            alert(error.message || 'Failed to start new game. Please try again.');
            console.error('Error restarting game:', error);
        }
    }
    
    /**
     * Share results - Clipboard on desktop, native share on mobile
     */
    shareResults() {
        const grade = getGrade(this.score);
        const text = `🏈 I scored ${this.score}/100 (${grade}) on Gridiron IQ! Test your elite NFL knowledge: ${window.location.href}`;
        
        // Detect if we're on a true mobile device (iOS/Android, not Windows desktop)
        const userAgent = navigator.userAgent;
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isWindows = /Windows/i.test(userAgent);
        const isTouchDevice = 'ontouchstart' in window;
        
        // Only use native share on actual mobile devices (iOS/Android), never on Windows
        // Windows has navigator.share but it opens an annoying dialog
        const shouldUseNativeShare = isMobileDevice && !isWindows && navigator.share;
        
        if (shouldUseNativeShare) {
            navigator.share({
                title: 'Gridiron IQ - My Results',
                text: text,
                url: window.location.href,
            }).catch(err => {
                // User cancelled or error occurred - fail silently
                if (err.name !== 'AbortError') {
                    console.log('Share error:', err);
                    // Fallback to clipboard on error
                    this.fallbackShare(text);
                }
            });
        } else {
            // Desktop/Windows: Always use clipboard (cleaner experience)
            this.fallbackShare(text);
        }
    }
    
    /**
     * Fallback share method (clipboard copy)
     */
    fallbackShare(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showShareFeedback('Copied to clipboard! 📋');
            }).catch(err => {
                console.error('Failed to copy:', err);
                // Last resort: show text in alert
                this.showShareFeedback('Tap to copy: ' + text.substring(0, 50) + '...');
            });
        } else {
            // Very old browser - show text
            prompt('Copy this text:', text);
        }
    }
    
    /**
     * Show share feedback (mobile-friendly toast)
     */
    showShareFeedback(message) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-[#CCFF00] px-6 py-3 rounded-2xl font-bold text-sm z-50 shadow-lg';
        toast.textContent = message;
        toast.style.animation = 'fadeInOut 3s ease-in-out';
        document.body.appendChild(toast);
        
        // Remove after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboard(e) {
        // Only handle if question screen is visible
        const questionScreen = document.getElementById('question-screen');
        if (!questionScreen || questionScreen.classList.contains('hidden')) {
            return;
        }
        
        // Answer selection (A, B, C, D or 1, 2, 3, 4)
        if (e.key === 'a' || e.key === 'A' || e.key === '1') {
            e.preventDefault();
            this.selectAnswer(0);
        } else if (e.key === 'b' || e.key === 'B' || e.key === '2') {
            e.preventDefault();
            this.selectAnswer(1);
        } else if (e.key === 'c' || e.key === 'C' || e.key === '3') {
            e.preventDefault();
            this.selectAnswer(2);
        } else if (e.key === 'd' || e.key === 'D' || e.key === '4') {
            e.preventDefault();
            this.selectAnswer(3);
        }
        
        // Next question (Enter or Space)
        if ((e.key === 'Enter' || e.key === ' ') && this.isAnswerSelected) {
            e.preventDefault();
            const nextBtn = document.getElementById('next-btn');
            const feedbackCard = document.getElementById('feedback-card');
            if (nextBtn && feedbackCard && !feedbackCard.classList.contains('hidden')) {
                this.nextQuestion();
            }
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new GridironGame();
    // Make game instance available globally for debugging
    window.gridironGame = game;
});
