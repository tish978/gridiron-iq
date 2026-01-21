"""
Question API endpoints
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from backend.models.question import Question
from backend.services.quiz import QuizService

router = APIRouter()

@router.get("/questions", response_model=dict)
async def get_questions(
    count: int = Query(default=4, ge=1, le=10, description="Number of questions to return"),
    categories: Optional[str] = Query(default=None, description="Comma-separated categories (History, Scheme)")
):
    """
    Fetch randomized question set
    
    - **count**: Number of questions (1-10, default: 4)
    - **categories**: Optional filter (History, Scheme)
    """
    try:
        category_list = None
        if categories:
            category_list = [c.strip() for c in categories.split(",")]
        
        questions = QuizService.get_random_questions(count, category_list)
        
        return {
            "questions": [q.dict() for q in questions]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching questions: {str(e)}")
