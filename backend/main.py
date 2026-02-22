
from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.core.config import settings
from backend.api import deps
from backend.api.v1 import auth, jobs, candidates, resumes, public, billing, interviews, system
import time
import logging

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Metrics Instrumentation
Instrumentator().instrument(app).expose(app, endpoint="/api/v1/metrics")

@app.middleware("http")
async def audit_log_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logging.info(f"Path: {request.url.path} Method: {request.method} Status: {response.status_code} Time: {process_time:.4f}s")
    return response

# API Routers
app.include_router(jobs.router, prefix=f"{settings.API_V1_STR}/jobs", tags=["jobs"])
app.include_router(candidates.router, prefix=f"{settings.API_V1_STR}/candidates", tags=["candidates"])
app.include_router(resumes.router, prefix=f"{settings.API_V1_STR}/resumes", tags=["resumes"])
app.include_router(public.router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(billing.router, prefix=f"{settings.API_V1_STR}/billing", tags=["billing"])
app.include_router(interviews.router, prefix=f"{settings.API_V1_STR}/interviews", tags=["interviews"])
app.include_router(system.router, prefix=f"{settings.API_V1_STR}/system", tags=["system"])

@app.get("/health")
def health_check(db: Session = Depends(deps.get_db)):
    """Liveness & Readiness probe for orchestrators."""
    try:
        # Check DB connectivity
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "version": "1.0.0",
            "engine": "FastAPI Enterprise",
            "database": "connected"
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}, 503

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
