<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3359cbb8-2601-49a0-af7c-4fb716828205

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# AI TalentHire — Enterprise AI Hiring SaaS

AI TalentHire is an enterprise-grade AI-powered Applicant Tracking System (ATS) SaaS platform that automates recruitment workflows from job posting to candidate screening, interview scheduling, and hiring analytics.

This platform demonstrates real-world SaaS architecture including multi-tenant isolation, AI resume screening, billing, and career portals.

---

## 🚀 Features

### ATS & Recruitment
- Job posting and management
- Candidate tracking pipeline
- Resume upload & parsing
- AI candidate scoring
- Fraud detection
- Interview scheduling

### AI Capabilities
- Resume skill extraction
- Experience analysis
- Semantic matching
- Candidate ranking
- AI interview evaluation

### SaaS & Enterprise
- Multi-tenant architecture
- Company accounts & roles
- RBAC permissions
- Billing & subscriptions
- Razorpay payments
- GST invoice support
- Usage limits

### Career Portal
- Public job listings
- Candidate application form
- Resume submission
- Automated pipeline entry

### Platform
- FastAPI backend
- PostgreSQL database
- Modular service architecture
- REST APIs
- Deployment ready

---

## 🧱 Architecture Overview

AI TalentHire follows a layered SaaS architecture:

- Frontend UI (ATS dashboard + career portal)
- Backend API (FastAPI)
- Service layer (business logic)
- Database (PostgreSQL)
- AI modules (NLP + scoring)
- Billing & subscriptions
- External integrations

---

## 📁 Project Structure


ai-talenthire/
│
├── backend/
│ ├── main.py
│ ├── models/
│ ├── services/
│ ├── routers/
│ ├── ai/
│ ├── billing/
│ └── config/
│
├── frontend/
│ ├── dashboard/
│ ├── careers/
│ ├── assets/
│ └── index.html
│
├── requirements.txt
├── package.json
├── .env.example
└── README.md


---

## ⚙️ Setup — Run Locally

### 1️⃣ Clone repository

```bash
git clone https://github.com/<your-username>/ai-talenthire.git
cd ai-talenthire
2️⃣ Backend setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs at:

http://localhost:8000
3️⃣ Frontend setup

If HTML/JS:

Open:

frontend/index.html

If React/TypeScript:

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173
🔐 Environment Variables

Create .env in backend:

POSTGRES_SERVER=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

SECRET_KEY=
API_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

GSTIN_SELLER=
COMPANY_LEGAL_NAME=
COMPANY_ADDRESS=
🧠 AI Modules

AI TalentHire includes:

Resume parsing

Skill extraction

Experience estimation

Semantic similarity scoring

Candidate ranking

Fraud detection

💳 Billing

Free tier (1 lifetime job)

Growth plan

Enterprise plan

Razorpay integration

GST invoices

🌐 Career Portal

Public routes:

/careers/{company}
/careers/{company}/job/{id}

Candidates can apply without login.

🏢 Multi-Tenant SaaS

Each company has isolated:

Jobs

Candidates

Billing

Users

Analytics

🧪 Demo Workflow

Company signup

Create job

Upload resumes

AI scoring

Candidate ranking

Schedule interview

📊 Tech Stack

Backend:

Python

FastAPI

PostgreSQL

SQLAlchemy

Frontend:

HTML / CSS / JS

TypeScript / React (if enabled)

AI:

sentence-transformers

spaCy

scikit-learn

Billing:

Razorpay

📈 Future Improvements

Video interview analysis

ML hiring prediction

Calendar integration

SSO login

Email automation

👤 Author

AI TalentHire SaaS ATS Platform
Built as an enterprise-grade recruitment system.

📄 License

MIT
