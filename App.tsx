
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3, 
  CreditCard, 
  ShieldCheck, 
  Globe,
  Plus,
  Search,
  BrainCircuit,
  Bot,
  Bell,
  Command,
  Calendar,
  AlertTriangle,
  ArrowRight,
  X
} from 'lucide-react';

import DashboardView from './components/Dashboard';
import ATSView from './components/ATS';
import JobDetailView from './components/JobDetail';
import AIInterviewer from './components/AIInterviewer';
import CareerPortal from './components/CareerPortal';
import BillingView from './components/Billing';
import AnalyticsView from './components/Analytics';
import InterviewsView from './components/Interviews';
import SettingsView from './components/Settings';
import LoginView from './components/Login';
import { MOCK_USER, MOCK_COMPANY } from './constants';
import { getAuthToken, removeAuthToken } from './services/apiClient';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Users, label: 'Candidates', path: '/candidates' },
    { icon: Calendar, label: 'Interviews', path: '/interviews' },
    { icon: Bot, label: 'AI Assessments', path: '/ai-interviews' },
    { icon: BarChart3, label: 'Intelligence', path: '/analytics' },
    { icon: Globe, label: 'Career Hub', path: '/careers/nebula-systems' }, // Example link
    { icon: CreditCard, label: 'Subscription', path: '/billing' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    removeAuthToken();
    window.location.hash = '/login';
  };

  return (
    <div className="w-64 h-screen bg-slate-950 text-slate-400 flex flex-col fixed left-0 top-0 border-r border-slate-800 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <BrainCircuit className="text-white" size={20} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-white font-black text-base tracking-tight">TALENTHIRE</h1>
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Enterprise AI</span>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:border-slate-700 transition-all">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-semibold text-slate-300 truncate">{MOCK_COMPANY.name}</span>
          </div>
          <Command size={12} className="text-slate-600 group-hover:text-slate-400" />
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="px-4 pb-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">Main Menu</p>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
              isActive(item.path) 
                ? 'bg-indigo-600/10 text-white border-l-2 border-indigo-600' 
                : 'hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <item.icon size={18} className={isActive(item.path) ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
            <span className="font-semibold text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 bg-slate-900/30 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 p-2">
          <img src={MOCK_USER.avatar} className="w-9 h-9 rounded-full ring-2 ring-slate-800 shadow-xl" />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{MOCK_USER.name}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Admin</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-black bg-slate-800 hover:bg-rose-900/20 hover:text-rose-400 text-slate-400 rounded-xl transition-all border border-slate-700 hover:border-rose-900/50"
        >
          <LogOut size={14} />
          SYSTEM LOGOUT
        </button>
      </div>
    </div>
  );
};

const Header = ({ onPostRole }: { onPostRole: () => void }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search candidates, jobs, or docs..." 
            className="bg-slate-100/50 border border-transparent focus:border-indigo-200 focus:bg-white rounded-xl pl-10 pr-4 py-2 text-sm w-80 outline-none transition-all"
          />
        </div>
        <div className="h-4 w-px bg-slate-200"></div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img key={i} src={`https://picsum.photos/seed/${i+10}/32`} className="w-6 h-6 rounded-full border-2 border-white" />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">3 Recruiters Online</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <button 
          onClick={onPostRole}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={16} />
          Post Role
        </button>
      </div>
    </header>
  );
};

const UpgradeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-rose-100 rounded-3xl mx-auto flex items-center justify-center text-rose-600">
            <AlertTriangle size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Limit Reached</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              Free plan allows only one lifetime job posting. <br />
              <span className="font-bold text-slate-900">Upgrade to Growth to continue hiring.</span>
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link 
              to="/billing" 
              onClick={onClose}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              View Pricing Plans
              <ArrowRight size={16} />
            </Link>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppLayout = ({ children }: React.PropsWithChildren<{}>) => {
  const token = getAuthToken();
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  if (!token) return <Navigate to="/login" replace />;

  const handlePostRole = () => {
    if (MOCK_COMPANY.plan === 'FREE_TRIAL' && MOCK_COMPANY.lifetime_job_used) {
      setShowUpgrade(true);
      return;
    }
    // In a real app, navigate to create job page
    alert("Proceeding to job creation...");
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 pl-64 flex flex-col">
        <Header onPostRole={handlePostRole} />
        <main className="p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        
        {/* Admin Routes */}
        <Route path="/" element={<AppLayout><DashboardView /></AppLayout>} />
        <Route path="/jobs" element={<AppLayout><ATSView /></AppLayout>} />
        <Route path="/jobs/:id" element={<AppLayout><JobDetailView /></AppLayout>} />
        <Route path="/candidates" element={<AppLayout><ATSView /></AppLayout>} />
        <Route path="/interviews" element={<AppLayout><InterviewsView /></AppLayout>} />
        <Route path="/ai-interviews" element={<AppLayout><AIInterviewer /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><AnalyticsView /></AppLayout>} />
        <Route path="/billing" element={<AppLayout><BillingView /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><SettingsView /></AppLayout>} />
        
        {/* Public Career Portal Routes */}
        <Route path="/careers/:company_slug" element={<CareerPortal />} />
        <Route path="/careers/:company_slug/job/:job_id" element={<CareerPortal />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
