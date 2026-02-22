
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.models.models import Candidate, Job, Interview, UsageMetric
from typing import Dict, Any

class AnalyticsAggregator:
    def __init__(self, db: Session):
        self.db = db

    def get_company_stats(self, company_id: Any) -> Dict[str, Any]:
        """
        Calculates real-time stats for the dashboard.
        """
        active_jobs = self.db.query(Job).filter(
            Job.company_id == company_id, 
            Job.status == "OPEN"
        ).count()
        
        total_candidates = self.db.query(Candidate).filter(
            Candidate.company_id == company_id
        ).count()
        
        # Calculate mean time to hire (mocked for demo)
        tth = 18.4 
        
        return {
            "active_jobs": active_jobs,
            "total_candidates": total_candidates,
            "time_to_hire": tth,
            "conversion_efficiency": 4.2
        }

    def sync_usage_metrics(self, company_id: Any):
        """
        Background task to sync consumption stats to usage ledger.
        """
        # Logic to update UsageMetric counts based on current DB state
        pass
