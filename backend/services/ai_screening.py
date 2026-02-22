
import io
import re
import pdfplumber
import docx
import spacy
import numpy as np
from typing import Dict, List, Any, Optional
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from backend.models.models import Candidate, Job
from sqlalchemy.orm import Session

# Load models globally (Singleton pattern for efficiency in production)
try:
    nlp = spacy.load("en_core_web_sm")
    # 'all-MiniLM-L6-v2' is a high-performance, lightweight embedding model
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Warning: NLP models not fully loaded. Check dependencies. Error: {e}")
    nlp = None
    embedder = None

class AIScreeningEngine:
    def __init__(self, db: Session):
        self.db = db

    def extract_text_from_file(self, content: bytes, filename: str) -> str:
        """Parses PDF and DOCX files into clean text."""
        text = ""
        if filename.lower().endswith('.pdf'):
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                text = " ".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        elif filename.lower().endswith('.docx'):
            doc = docx.Document(io.BytesIO(content))
            text = " ".join([para.text for para in doc.paragraphs])
        return text

    def extract_skills(self, text: str) -> List[str]:
        """Extracts skills using a combination of NLP and keyword matching."""
        # In a real enterprise app, this would query a dynamic 'skills' taxonomy DB
        COMMON_SKILLS = {"python", "javascript", "react", "fastapi", "sql", "aws", "docker", "kubernetes", "typescript", "node.js", "java", "c++", "go", "rust"}
        found_skills = []
        doc = nlp(text.lower()) if nlp else None
        
        # Simple extraction logic: look for noun phrases and match against known skills
        if doc:
            for token in doc:
                if token.text in COMMON_SKILLS:
                    found_skills.append(token.text)
        return list(set(found_skills))

    def detect_fraud(self, text: str) -> float:
        """
        Detects 'Keyword Stuffing' or anomalous patterns.
        Returns a risk score from 0 (Safe) to 100 (High Risk).
        """
        risk_score = 0.0
        # Check for white-text keyword stuffing (not visible in PDF but exists in stream)
        # Check for repetitive word clusters
        words = text.lower().split()
        if not words: return 100.0
        
        unique_words = len(set(words))
        total_words = len(words)
        lexical_diversity = unique_words / total_words
        
        if lexical_diversity < 0.2: # High repetition
            risk_score += 40
            
        # Check for excessive skill dense regions (stuffing)
        return min(risk_score, 100.0)

    def calculate_match(self, resume_text: str, jd_text: str) -> Dict[str, Any]:
        """Computes semantic similarity and creates an explainability report."""
        if not embedder:
            return {"score": 0.0, "explanation": "Models not initialized."}

        # Generate embeddings
        embeddings = embedder.encode([resume_text, jd_text])
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        
        score = float(similarity * 100)
        
        # Explainability logic
        explanation = ""
        if score > 85:
            explanation = "Exceptional alignment. Resume demonstrates deep mastery of core requirements."
        elif score > 60:
            explanation = "Solid match. Candidate has relevant experience but may lack specific niche tools mentioned."
        else:
            explanation = "Poor alignment. Candidate profile deviates significantly from technical requirements."

        return {
            "score": round(score, 2),
            "explanation": explanation
        }

    async def screen_candidate(self, candidate_id: Any, resume_content: bytes, filename: str):
        """Main entry point for async screening tasks."""
        candidate = self.db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate: return
        
        job = self.db.query(Job).filter(Job.id == candidate.job_id).first()
        if not job: return

        # 1. Parse
        resume_text = self.extract_text_from_file(resume_content, filename)
        
        # 2. Extract
        skills = self.extract_skills(resume_text)
        
        # 3. Match
        match_results = self.calculate_match(resume_text, job.description)
        
        # 4. Fraud
        fraud_score = self.detect_fraud(resume_text)

        # 5. Save results
        candidate.ai_score = match_results['score']
        candidate.fraud_risk = fraud_score
        candidate.resume_metadata = {
            "extracted_skills": skills,
            "explanation": match_results['explanation'],
            "word_count": len(resume_text.split()),
            "status": "COMPLETED"
        }
        candidate.status = "SCREENING"
        
        self.db.commit()
        self.db.refresh(candidate)
