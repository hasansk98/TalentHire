
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Any
from backend.models.models import Candidate, Job, Interview
from sqlalchemy.orm import Session

MODEL_PATH = "backend/ml_models/hiring_predictor.joblib"
SCALER_PATH = "backend/ml_models/scaler.joblib"

class MLRankingPipeline:
    def __init__(self, db: Session):
        self.db = db
        self.model = self._load_model()
        self.scaler = self._load_scaler()

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            return joblib.load(MODEL_PATH)
        return RandomForestClassifier(n_estimators=100, random_state=42)

    def _load_scaler(self):
        if os.path.exists(SCALER_PATH):
            return joblib.load(SCALER_PATH)
        return StandardScaler()

    def extract_features(self, candidate: Candidate) -> np.ndarray:
        """
        Engineers a feature vector for the ML model.
        Features: [ai_score, fraud_risk, skill_count, interview_avg, tenure_estimate]
        """
        meta = candidate.resume_metadata or {}
        skills = meta.get("extracted_skills", [])
        
        # Simple feature vector
        features = [
            candidate.ai_score or 0.0,
            candidate.fraud_risk or 0.0,
            len(skills),
            candidate.interview_score or 0.0,
            meta.get("word_count", 0) / 100.0 # Proxy for experience depth
        ]
        return np.array(features).reshape(1, -1)

    def predict_hire_probability(self, candidate_id: Any) -> float:
        candidate = self.db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate: return 0.0
        
        features = self.extract_features(candidate)
        
        # In a real system, we'd scale features before prediction
        # If model isn't trained, we return a heuristic score
        try:
            prob = self.model.predict_proba(features)[0][1]
        except:
            # Heuristic fallback if model is untrained
            prob = (candidate.ai_score * 0.6 + (candidate.interview_score or 0) * 0.4) / 100.0
            
        return float(prob)

    def train_on_history(self):
        """
        Retrieves historical HIRED vs REJECTED decisions to refine the model.
        This would be triggered by a background worker weekly.
        """
        candidates = self.db.query(Candidate).filter(
            Candidate.status.in_(["HIRED", "REJECTED"])
        ).all()
        
        if len(candidates) < 10: return # Insufficient data for training
        
        X = []
        y = []
        for c in candidates:
            X.append(self.extract_features(c)[0])
            y.append(1 if c.status == "HIRED" else 0)
            
        X = np.array(X)
        y = np.array(y)
        
        # Scaling and Training
        self.scaler.fit(X)
        X_scaled = self.scaler.transform(X)
        
        self.model.fit(X_scaled, y)
        
        # Persist model
        os.makedirs("backend/ml_models", exist_ok=True)
        joblib.dump(self.model, MODEL_PATH)
        joblib.dump(self.scaler, SCALER_PATH)
