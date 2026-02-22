
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
// Added Bot to the imported icons from lucide-react
import { Search, MapPin, Clock, Globe, ArrowRight, BrainCircuit, ShieldCheck, Mail, Upload, Loader2, ChevronLeft, ArrowLeft, Bot } from 'lucide-react';
import { INITIAL_JOBS, MOCK_COMPANY } from '../constants';
import { Job } from '../types';

const CareerPortal = () => {
  const { company_slug, job_id } = useParams();
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS); // Defaulting to mock for visual demo
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [file, setFile] = useState<File | null>(null);

  // In a real production build, these would be fetch calls
  useEffect(() => {
    if (job_id) {
      const job = jobs.find(j => j.id === job_id);
      if (job) setSelectedJob(job);
    } else {
      setSelectedJob(null);
    }
  }, [job_id, jobs]);

  const handleApply = async () => {
    if (!formData.name || !formData.email || !file) {
      alert("Please fill all fields and upload a resume.");
      return;
    }
    
    setIsUploading(true);
    
    // Simulating public API application submission
    setTimeout(() => {
      setIsUploading(false);
      alert(`Success! Application for ${formData.name} has been submitted. Our AI screening is currently analyzing your background for the ${selectedJob?.title} role.`);
      setIsApplying(false);
      setFormData({ name: '', email: '' });
      setFile(null);
    }, 2500);
  };

  // Added key?: string to the props type definition to satisfy TypeScript when this component is used in a map function
  const JobCard = ({ job }: { job: Job; key?: string }) => (
    <div 
      className="group bg-white p-8 rounded-3xl border border-slate-200 hover:border-indigo-500 hover:shadow-2xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer"
      onClick={() => window.location.hash = `/careers/${company_slug}/job/${job.id}`}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
          <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</div>
          <div className="flex items-center gap-1.5"><Globe size={14} /> {job.department}</div>
          <div className="flex items-center gap-1.5"><Clock size={14} /> {job.type}</div>
        </div>
      </div>
      <button className="mt-4 md:mt-0 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold group-hover:bg-indigo-600 transition-all flex items-center gap-2">
        Details
        <ArrowRight size={18} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 h-20 flex items-center justify-between px-6 md:px-12 sticky top-0 bg-white/90 backdrop-blur-xl z-[60]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = `/careers/${company_slug}`}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="text-white" />
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tighter uppercase">{company_slug?.replace('-', ' ')} <span className="text-indigo-600">Careers</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-black uppercase tracking-widest text-slate-500">
          <a href="#" className="text-indigo-600">Open Positions</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Culture</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Team</a>
        </div>
      </nav>

      {/* Hero Section */}
      {!selectedJob && (
        <div className="bg-slate-50 py-32 px-6 text-center border-b border-slate-100">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/5 text-indigo-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
              <ShieldCheck size={14} /> Verified Enterprise Employer
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Engineer the next <br /> <span className="text-indigo-600">AI Revolution</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Join a team of visionaries dedicated to building high-performance AI infrastructure that scales globally.
            </p>
            <div className="flex items-center max-w-2xl mx-auto bg-white p-2 rounded-[2rem] shadow-2xl border border-slate-200 mt-12 group focus-within:border-indigo-500 transition-all">
              <Search className="text-slate-400 ml-6" size={20} />
              <input 
                type="text" 
                placeholder="Search by role or expertise..." 
                className="flex-1 px-4 py-4 outline-none text-slate-900 font-medium"
              />
              <button className="bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-600/20">
                Scan Roles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-5xl mx-auto py-20 px-6 space-y-16">
        {selectedJob ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-12">
            <button 
              onClick={() => window.location.hash = `/careers/${company_slug}`}
              className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={16} /> Back to Listings
            </button>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="space-y-4 flex-1">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{selectedJob.title}</h2>
                <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-400">
                  <div className="flex items-center gap-2"><MapPin size={18} className="text-indigo-500" /> {selectedJob.location}</div>
                  <div className="flex items-center gap-2"><Globe size={18} className="text-indigo-500" /> {selectedJob.department}</div>
                  <div className="flex items-center gap-2"><Clock size={18} className="text-indigo-500" /> {selectedJob.type}</div>
                </div>
              </div>
              <button 
                onClick={() => setIsApplying(true)}
                className="w-full md:w-auto bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-600/20 transition-all active:scale-95"
              >
                Apply for Role
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-slate-100">
              <div className="lg:col-span-2 space-y-10">
                <section className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Overview</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    We are searching for a high-impact individual to join our mission-critical systems team. You will be at the forefront of designing resilient architectures that power our AI engines.
                  </p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Core Competencies</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Advanced System Architecture', 'Cloud-Native Distributed Systems', 'Deep Analytical Reasoning', 'Collaborative Leadership'].map(item => (
                      <li key={item} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-sm text-slate-700">
                        <ShieldCheck className="text-indigo-500" size={18} /> {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-2xl">
                   {/* Bot icon usage fix: Bot is now imported */}
                   <Bot className="text-indigo-400 mb-4" size={32} />
                   <h4 className="text-lg font-black mb-2">AI-Powered Hiring</h4>
                   <p className="text-slate-400 text-xs leading-relaxed font-medium">
                     Your application will be instantly analyzed by our neural scoring engine to ensure a fast, unbiased response.
                   </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Current Openings</h2>
              <div className="flex gap-4">
                <div className="px-5 py-2.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} /> Remote Filter
                </div>
                <div className="px-5 py-2.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14} /> Global Access
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              {/* JobCard usage fix: key prop is now allowed in JobCard component type */}
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-32 px-6 mt-32 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-1 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                <BrainCircuit size={28} />
              </div>
              <span className="font-black text-3xl tracking-tighter uppercase">{company_slug?.split('-')[0]}</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              Constructing the neurological foundation for future digital intelligence.
            </p>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-black text-sm uppercase tracking-widest text-indigo-400 mb-8">Navigation</h4>
            <ul className="space-y-5 text-slate-300 font-bold text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Global Offices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Diversity Report</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tech Blog</a></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-black text-sm uppercase tracking-widest text-indigo-400 mb-8">Resources</h4>
            <ul className="space-y-5 text-slate-300 font-bold text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Interview Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Benefits Pack</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Legal & Privacy</a></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-black text-sm uppercase tracking-widest text-indigo-400 mb-8">Contact Identity</h4>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center">
                <Mail size={20} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 mt-32 pt-12 flex flex-col md:flex-row justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
          <p>© 2024 {company_slug?.toUpperCase()} SYSTEMS. POWERED BY TALENTHIRE AI.</p>
          <div className="flex gap-12 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Data Processing Addendum</a>
            <a href="#" className="hover:text-white transition-colors">Security Disclosure</a>
          </div>
        </div>
      </footer>

      {/* Application Modal */}
      {isApplying && selectedJob && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Express Interest</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Role: {selectedJob.title}</p>
              </div>
              <button onClick={() => setIsApplying(false)} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">✕</button>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Legal Identifier</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Satoshi Nakamoto" 
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500/50 outline-none transition-all font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Digital Endpoint</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="candidate@global.ai" 
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500/50 outline-none transition-all font-bold text-sm" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Talent Dossier (PDF)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center hover:border-indigo-500/50 hover:bg-indigo-50/10 transition-all cursor-pointer group relative">
                   <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept=".pdf,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                   />
                  <Upload className="mx-auto text-slate-300 group-hover:text-indigo-500 transition-all mb-6" size={48} />
                  <p className="text-sm font-black text-slate-600 uppercase tracking-widest">
                    {file ? file.name : 'Select or drop resume'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Strictly PDF or DOCX format</p>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl flex gap-4 items-start shadow-xl">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  {/* Bot icon usage fix: Bot is now imported */}
                  <Bot className="text-white" size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Neural Guard Protection</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    TalentHire AI utilizes biometric integrity checks and semantic verification to ensure a fair, high-speed evaluation of your profile.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleApply}
                disabled={isUploading}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-2xl transition-all flex items-center justify-center gap-3 ${
                  isUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-600/20'
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Activating AI Core...
                  </>
                ) : 'Submit Dossier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPortal;
