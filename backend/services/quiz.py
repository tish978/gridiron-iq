"""
Quiz business logic - question selection and scoring
"""
import json
import random
import os
from typing import List, Optional
from backend.models.question import Question

class QuizService:
    """Service for quiz operations"""
    
    @staticmethod
    def _get_data_file_path():
        """Get the path to questions.json file"""
        # Get the backend directory
        backend_dir = os.path.dirname(os.path.dirname(__file__))
        # Construct path to data/questions.json
        return os.path.join(backend_dir, "data", "questions.json")
    
    @staticmethod
    def load_all_questions() -> List[Question]:
        """Load all questions from JSON file"""
        data_file = QuizService._get_data_file_path()
        try:
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return [Question(**q) for q in data]
        except FileNotFoundError:
            raise Exception(f"Questions file not found: {data_file}")
        except json.JSONDecodeError as e:
            raise Exception(f"Invalid JSON in questions file: {str(e)}")
        except Exception as e:
            raise Exception(f"Error loading questions: {str(e)}")
    
    @staticmethod
    def _shuffle_answers(question: Question) -> Question:
        """
        Shuffle answer options and update correct index
        
        Args:
            question: Question object to shuffle
        
        Returns:
            New Question object with shuffled answers
        """
        # Create a list of (index, answer) pairs
        answers_with_indices = list(enumerate(question.a))
        
        # Shuffle the answers
        random.shuffle(answers_with_indices)
        
        # Find the new position of the correct answer
        new_correct_index = None
        shuffled_answers = []
        
        for new_index, (old_index, answer) in enumerate(answers_with_indices):
            shuffled_answers.append(answer)
            if old_index == question.correct:
                new_correct_index = new_index
        
        # Create a new question with shuffled answers
        return Question(
            id=question.id,
            q=question.q,
            a=shuffled_answers,
            correct=new_correct_index,
            type=question.type,
            expl=question.expl,
            difficulty=question.difficulty
        )
    
    @staticmethod
    def get_random_questions(count: int, categories: Optional[List[str]] = None) -> List[Question]:
        """
        Get random questions from the bank with shuffled answer options
        
        Args:
            count: Number of questions to return
            categories: Optional list of categories to filter by
        
        Returns:
            List of Question objects with randomized answer positions
        """
        all_questions = QuizService.load_all_questions()
        
        # Filter by categories if provided
        if categories:
            filtered = [q for q in all_questions if q.type in categories]
            if not filtered:
                # If no questions match categories, return all
                filtered = all_questions
        else:
            filtered = all_questions
        
        # Ensure we don't request more than available
        count = min(count, len(filtered))
        
        # Get random sample
        selected_questions = random.sample(filtered, count)
        
        # Shuffle answer options for each question
        shuffled_questions = [QuizService._shuffle_answers(q) for q in selected_questions]
        
        return shuffled_questions
