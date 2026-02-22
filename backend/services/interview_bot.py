
from typing import List, Dict, Any
from backend.models.models import Interview, Candidate, Job
from sqlalchemy.orm import Session
from google.generativeai import GoogleGenerativeAI
import os

class AIInterviewService:
    def __init__(self, db: Session):
        self.db = db
        # Using Gemini 3 Flash for low-latency interview conversations
        self.ai = GoogleGenerativeAI(api_key=os.getenv("API_KEY"))

    async def get_next_question(self, interview_id: Any, chat_history: List[Dict[str, str]]) -> str:
        interview = self.db.query(Interview).filter(Interview.id == interview_id).first()
        job = self.db.query(Job).filter(Job.id == interview.candidate.job_id).first()
        
        system_prompt = f"""
        You are an elite AI Interviewer at Nebula Systems. 
        You are interviewing for the position: {job.title}.
        Role Description: {job.description}.
        
        Guidelines:
        1. Ask one concise, high-impact question at a time.
        2. Mix technical depth with behavioral attributes.
        3. If the candidate gives a shallow answer, probe deeper.
        4. Be professional but encouraging.
        """
        
        messages = [{"role": "system", "content": system_prompt}] + chat_history
        
        # In a real implementation, we'd use the chat.sendMessage flow
        # For simplicity in this module, we generate based on context
        response = await self.ai.models.generateContent(
            model='gemini-3-flash-preview',
            contents=[{"parts": [{"text": str(messages)}]}]
        )
        return response.text

    async def finalize_and_score(self, interview_id: Any, transcript: List[Dict[str, str]]):
        interview = self.db.query(Interview).filter(Interview.id == interview_id).first()
        
        scoring_prompt = f"""
        Analyze the following interview transcript and provide a structured JSON evaluation.
        
        Transcript: {str(transcript)}
        
        Required JSON fields:
        - technical_score (0-100)
        - communication_score (0-100)
        - summary (string)
        - strengths (list)
        - weak_points (list)
        - hire_recommendation (boolean)
        """
        
        response = await self.ai.models.generateContent(
            model='gemini-3-pro-preview',
            contents=scoring_prompt,
            config={"responseMimeType": "application/json"}
        )
        
        import json
        metrics = json.loads(response.text)
        
        interview.status = "COMPLETED"
        interview.ai_metrics = metrics
        interview.transcript = transcript
        interview.feedback = metrics.get("summary")
        
        # Sync score back to candidate for ranking
        candidate = self.db.query(Candidate).filter(Candidate.id == interview.candidate_id).first()
        candidate.interview_score = metrics.get("technical_score")
        
        self.db.commit()
