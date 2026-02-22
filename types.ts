
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  RECRUITER = 'RECRUITER',
  VIEWER = 'VIEWER'
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ON_HOLD = 'ON_HOLD'
}

export enum CandidateStatus {
  NEW = 'NEW',
  SCREENING = 'SCREENING',
  INTERVIEWING = 'INTERVIEWING',
  OFFER = 'OFFER',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: 'FREE_TRIAL' | 'GROWTH' | 'ENTERPRISE';
  subscriptionStatus: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED';
  lifetime_job_used: boolean;
  jobs_created: number;
  gstin?: string;
  billing_address?: string;
  state_code?: string;
}

export interface Plan {
  id: string;
  name: string;
  price_inr: number;
  max_jobs: number;
  max_resumes: number;
  max_hr_users: number;
  features: string[];
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'FULL_TIME' | 'CONTRACT' | 'PART_TIME';
  status: JobStatus;
  description: string;
  salaryRange?: string;
  companyId: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  status: CandidateStatus;
  resumeUrl: string;
  aiScore: number;
  fraudRiskScore: number;
  mlRanking: number;
  skills: string[];
  lastActivity: string;
  interviewScore?: number;
  resume_metadata?: AIAnalysis;
  companyId: string;
}

export interface AIAnalysis {
  overallScore: number;
  fraudRiskScore: number;
  skillsMatch: string[];
  missingSkills: string[];
  experienceMatch: string;
  fraudIndicators: string[];
  recommendation: 'STRONG_HIRE' | 'CONSIDER' | 'PASS';
  explanation: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  interviewerId: string;
  scheduledAt: string;
  duration: number; // minutes
  type: 'AI_CHAT' | 'VIDEO' | 'LIVE';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  feedback?: string;
}
