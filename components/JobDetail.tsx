
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Share2, Edit2, Archive, Globe, MapPin, Users, Target, Activity } from 'lucide-react';
import { INITIAL_JOBS } from '../constants';

const JobDetail = () => {
  const { id } = useParams();
  const job = INITIAL_JOBS.find(j => j.id === id) || INITIAL_JOBS[0];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
        <Link to="/jobs" className="hover:text-indigo-600 flex items-center gap-1">
          <ChevronLeft size={16} /> Back to Jobs
        </Link>
        <span>/</span>
        <span className="text-slate-900">{job.title}</span>
      </div>

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900">{job.title}</h1>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-widest">Active</span>
          </div>
          <div className="flex items-center gap-6 text-slate-500 font-medium">
            <div className="flex items-center gap-1.5"><MapPin size={18} /> {job.location}</div>
            <div className="flex items-center gap-1.5"><Globe size={18} /> {job.department}</div>
            <div className="flex items-center gap-1.5 font-bold text-indigo-600">ID: #{job.id}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-all"><Share2 size={18} /></button>
          <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-all"><Edit2 size={18} /></button>
          <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-all text-rose-500"><Archive size={18} /></button>
          <div className="w-px h-10 bg-slate-200 mx-2" />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            Publish Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity size={20} className="text-indigo-500" />
              Hiring Funnel
            </h3>
            <div className="flex items-end gap-2 h-40">
              {[
                { label: 'Sourced', value: 245, color: 'bg-indigo-400' },
                { label: 'Applied', value: 182, color: 'bg-indigo-500' },
                { label: 'AI Screened', value: 84, color: 'bg-indigo-600' },
                { label: 'Interviewed', value: 12, color: 'bg-indigo-700' },
                { label: 'Offered', value: 3, color: 'bg-indigo-800' },
              ].map((step, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className={`w-full rounded-t-xl ${step.color} transition-all group-hover:opacity-80 relative flex items-center justify-center`}
                    style={{ height: `${(step.value / 245) * 100}%` }}
                  >
                    <span className="text-white text-xs font-bold">{step.value}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter text-center h-8 leading-tight">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold">Job Description</h3>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>We are seeking an exceptional Senior Frontend Engineer to join our core architecture team. You will be responsible for defining the user experience of our next-generation enterprise platforms.</p>
              <h4 className="font-bold text-slate-900 mt-6">Key Responsibilities</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Architect robust, scalable frontend systems using React and TypeScript.</li>
                <li>Collaborate with product designers to create pixel-perfect interfaces.</li>
                <li>Implement complex data visualizations and real-time dashboards.</li>
                <li>Mentor junior engineers and lead architectural reviews.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Target size={18} className="text-emerald-500" />
              AI Search Profile
            </h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'System Design', 'Cloud Arch'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs font-medium text-emerald-800 leading-relaxed">
                AI is currently monitoring LinkedIn and GitHub for candidates matching this profile. 14 new matches found today.
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200 space-y-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold">Talent Quality Index</h3>
              <Users size={24} className="text-indigo-300" />
            </div>
            <div className="text-4xl font-black">84%</div>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
              Your candidate pool for this role is in the top 15% of the market in terms of skill matching.
            </p>
            <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
              Compare with Market
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
