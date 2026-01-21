/**
 * API Communication Layer
 * Handles all HTTP requests to the backend
 */

const API_BASE = window.location.origin;

/**
 * Fetch randomized question set from backend
 * @param {number} count - Number of questions to fetch (default: 4)
 * @param {string[]} categories - Optional category filter
 * @returns {Promise<Array>} Array of question objects
 */
export async function getQuestions(count = 4, categories = null) {
    try {
        let url = `${API_BASE}/api/questions?count=${count}`;
        
        if (categories && categories.length > 0) {
            url += `&categories=${categories.join(',')}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw new Error('Failed to load questions. Please try again.');
    }
}

/**
 * Submit game results (future feature)
 * @param {Object} result - Game result data
 * @returns {Promise<Object>} Server response
 */
export async function submitScore(result) {
    try {
        const response = await fetch(`${API_BASE}/api/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error submitting score:', error);
        throw new Error('Failed to submit score. Please try again.');
    }
}
