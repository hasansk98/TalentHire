
import { UserRole, JobStatus, CandidateStatus, Job, Candidate, User, Company, Plan } from './types';

export const MOCK_COMPANY: Company = {
  id: 'c1-uuid',
  name: 'Nebula Systems Inc.',
  slug: 'nebula-systems',
  plan: 'FREE_TRIAL',
  subscriptionStatus: 'ACTIVE',
  lifetime_job_used: true,
  jobs_created: 1,
  gstin: '27AAACT1234A1Z1',
  billing_address: '404, Cyber Hub, Gurgaon, Haryana 122002',
  state_code: '06'
};

export const PLANS: Plan[] = [
  {
    id: 'p-free',
    name: 'Free Trial',
    price_inr: 0,
    max_jobs: 1,
    max_resumes: 10,
    max_hr_users: 1,
    features: ['1 Lifetime Job', '10 Resumes Total', '1 HR User']
  },
  {
    id: 'p-growth',
    name: 'Growth',
    price_inr: 15000,
    max_jobs: 10,
    max_resumes: 500,
    max_hr_users: 5,
    features: ['10 Active Jobs', '500 Resumes/Month', '5 HR Users', 'AI Screening', 'Analytics', 'Interview Scheduling']
  },
  {
    id: 'p-enterprise',
    name: 'Enterprise',
    price_inr: 35000,
    max_jobs: Infinity,
    max_resumes: Infinity,
    max_hr_users: Infinity,
    features: ['Unlimited Jobs', 'Unlimited Resumes', 'Unlimited HR Users', 'Video Interview', 'AI Interview Bot', 'SSO', 'Custom Domain']
  }
];

export const MOCK_USER: User = {
  id: 'u1-uuid',
  email: 'alex.hiring@nebula.ai',
  name: 'Alex Rivera',
  role: UserRole.COMPANY_ADMIN,
  companyId: MOCK_COMPANY.id,
  avatar: 'https://picsum.photos/seed/alex/200'
};

export const INITIAL_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote (USA)',
    type: 'FULL_TIME',
    status: JobStatus.OPEN,
    description: 'Lead the React transformation...',
    companyId: MOCK_COMPANY.id,
    createdAt: new Date().toISOString()
  },
  {
    id: 'j2',
    title: 'Product Designer (L5)',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'FULL_TIME',
    status: JobStatus.OPEN,
    description: 'Design the future of AI interfaces...',
    companyId: MOCK_COMPANY.id,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'can1',
    jobId: 'j1',
    name: 'Sarah Chen',
    email: 'sarah.c@gmail.com',
    status: CandidateStatus.INTERVIEWING,
    resumeUrl: '#',
    aiScore: 92,
    fraudRiskScore: 3,
    mlRanking: 0.98,
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    lastActivity: '2 hours ago',
    companyId: MOCK_COMPANY.id
  },
  {
    id: 'can2',
    jobId: 'j1',
    name: 'David Miller',
    email: 'dave.miller@tech.co',
    status: CandidateStatus.SCREENING,
    resumeUrl: '#',
    aiScore: 78,
    fraudRiskScore: 12,
    mlRanking: 0.81,
    skills: ['React', 'JavaScript', 'CSS'],
    lastActivity: '1 day ago',
    companyId: MOCK_COMPANY.id
  }
];
