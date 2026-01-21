"""
Pydantic models for Question data
"""
from pydantic import BaseModel, Field
from typing import Literal
from uuid import uuid4

class Question(BaseModel):
    """Question model with validation"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    q: str = Field(..., description="Question text")
    a: list[str] = Field(..., min_items=4, max_items=4, description="4 answer options")
    correct: int = Field(..., ge=0, le=3, description="Index of correct answer (0-3)")
    type: Literal["History", "Scheme"] = Field(..., description="Question category")
    expl: str = Field(..., description="Explanation/context")
    difficulty: int = Field(default=5, ge=1, le=10, description="Difficulty level (1-10)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "q": "What is the 'Wildcat' formation?",
                "a": [
                    "A direct-snap formation with no QB under center",
                    "A 3-4 defense with edge rushers",
                    "A special teams fake punt play",
                    "A two-point conversion strategy"
                ],
                "correct": 0,
                "type": "Scheme",
                "expl": "The Wildcat became famous in 2008 when the Miami Dolphins used it to confuse defenses by snapping directly to a running back.",
                "difficulty": 6
            }
        }
