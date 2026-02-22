
# TalentHire AI Enterprise Platform

## Core Capabilities
- **Multi-Tenant Isolation**: Row-level security via `company_id`.
- **Neural Screening**: Gemini-3 Pro powered resume analysis.
- **Predictive Ranking**: ML pipeline for hiring probability.
- **SaaS Billing**: Integrated plan limits and feature flagging.

## Local Development (Native)
1. Install dependencies: `pip install -r backend/requirements.txt`
2. Set environment: `cp .env.example .env`
3. Run API: `uvicorn backend.main:app --reload`

## Docker Deployment (Recommended)
Launch the entire enterprise stack with one command:
```bash
docker-compose up --build
```
This starts:
- **API**: Port 8000 (FastAPI)
- **Worker**: Background AI processing
- **Postgres**: Enterprise data store
- **Redis**: Task queue & caching

## Cloud Scaling & Production Notes
- **Storage**: Set `STORAGE_BACKEND=s3` in production for high availability and durability.
- **Horizontal Scaling**: The `api` and `worker` services are stateless and can be scaled to N instances behind a Load Balancer.
- **Database**: In AWS/GCP, use managed RDS/CloudSQL for automated backups and multi-AZ support.
- **Security**:
  - Rotate `SECRET_KEY` via CI/CD pipelines.
  - Use `https` always for career portals.
  - Enable VPC peering between API and DB.

## Monitoring
- **Health**: `GET /health`
- **Metrics**: `GET /api/v1/metrics` (Prometheus format)
