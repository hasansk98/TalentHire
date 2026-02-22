
# TalentHire AI Enterprise Backend

## AI Screening Engine Core

The TalentHire AI screening engine uses state-of-the-art NLP to provide deep candidate insights.

### Architecture
- **Parser Layer**: Uses `pdfplumber` and `python-docx` for reliable text extraction from structured documents.
- **NLP Layer**: Uses `spaCy` for entity recognition (skills) and `sentence-transformers` for semantic embeddings.
- **Scoring Engine**: Implements cosine similarity matching against Job Descriptions (JDs) to produce a 0-100 match score.
- **Trust & Integrity**: A fraud detection module analyzes lexical diversity to identify keyword-stuffed resumes.

### Multi-Tenancy Isolation
Every database query is strictly filtered by `company_id` extracted from the JWT. This ensures zero data leakage between enterprise clients.

### Scalability
Screening tasks are designed as non-blocking background tasks. In a production cluster, these should be offloaded to **Celery workers** with **Redis** as a broker.

### ML Ranking Pipeline
The `Candidate` table stores `ml_ranking` which can be periodically updated by a dedicated ML pipeline training on historical hiring data (Hire vs Pass decisions).
