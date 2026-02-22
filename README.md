AI TalentHire — Enterprise AI Hiring SaaS

AI TalentHire is an enterprise-grade AI-powered Applicant Tracking System (ATS) SaaS platform that automates recruitment workflows from job posting to candidate screening, interview scheduling, and hiring analytics.

This project demonstrates real-world SaaS architecture including multi-tenant isolation, AI resume screening, billing, and public career portals.

🚀 Features
ATS & Recruitment

Job posting and management

Candidate tracking pipeline

Resume upload & parsing

AI candidate scoring

Fraud detection

Interview scheduling

AI Capabilities

Resume skill extraction

Experience analysis

Semantic matching

Candidate ranking

AI interview evaluation

SaaS & Enterprise

Multi-tenant architecture

Company accounts & roles

RBAC permissions

Billing & subscriptions

Razorpay payments

GST invoice support

Usage limits

Career Portal

Public job listings

Candidate application form

Resume submission

Automated pipeline entry

🧭 System Architecture
                ┌────────────────────┐
                │   Web Frontend     │
                │ ATS Dashboard UI   │
                │ Career Portal      │
                └─────────┬──────────┘
                          │ HTTP
                          ▼
                ┌────────────────────┐
                │   FastAPI Backend  │
                │ REST API Layer     │
                └─────────┬──────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌─────────────┐  ┌────────────────┐  ┌──────────────┐
│ AI Modules   │  │ Billing Engine │  │ Auth & RBAC  │
│ Resume NLP   │  │ Subscriptions  │  │ Multi-tenant │
│ Scoring      │  │ Razorpay       │  │ Roles        │
└─────────────┘  └────────────────┘  └──────────────┘
                          │
                          ▼
                ┌────────────────────┐
                │   PostgreSQL DB    │
                │ Jobs               │
                │ Candidates         │
                │ Companies          │
                │ Billing            │
                └────────────────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ External Services  │
                │ Razorpay Payments  │
                │ Email / Storage    │
                └────────────────────┘
📁 Project Structure
ai-talenthire/
│
├── backend/
│   ├── main.py
│   ├── models/
│   ├── services/
│   ├── routers/
│   ├── ai/
│   ├── billing/
│   └── config/
│
├── frontend/
│   ├── dashboard/
│   ├── careers/
│   ├── assets/
│   └── index.html
│
├── requirements.txt
├── package.json
├── .env.example
└── README.md
⚙️ Setup — Run Locally
1️⃣ Clone repository
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

Backend

Python

FastAPI

PostgreSQL

SQLAlchemy

Frontend

HTML / CSS / JS

TypeScript / React

AI

sentence-transformers

spaCy

scikit-learn

Billing

Razorpay

👤 Author

AI TalentHire SaaS ATS Platform

📄 License

MIT
