
import React from 'react';
import { 
  Users, 
  Briefcase, 
  Timer, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', apps: 45, hires: 2 },
  { name: 'Tue', apps: 52, hires: 3 },
  { name: 'Wed', apps: 38, hires: 1 },
  { name: 'Thu', apps: 65, hires: 4 },
  { name: 'Fri', apps: 48, hires: 2 },
  { name: 'Sat', apps: 15, hires: 0 },
  { name: 'Sun', apps: 10, hires: 0 },
];

const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <div className="glass-card p-6 rounded-[2rem] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
      <Icon size={120} />
    </div>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3.5 rounded-2xl ${color} shadow-lg shadow-current/10`}>
        <Icon className="text-white" size={24} />
      </div>
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {change}
      </div>
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{title}</p>
    <h3 className="text-3xl font-black text-slate-900 tabular-nums">{value}</h3>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Hub</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Global performance tracking for <span className="text-indigo-600 font-bold">Nebula Systems</span></p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-200/50 p-1 rounded-xl">
            <button className="px-4 py-2 text-xs font-bold bg-white rounded-lg shadow-sm text-slate-900">Real-time</button>
            <button className="px-4 py-2 text-xs font-bold text-slate-500">History</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Talent" value="2,845" change="+12.5%" trend="up" icon={Users} color="bg-indigo-600" />
        <StatCard title="Open Positions" value="48" change="+4" trend="up" icon={Briefcase} color="bg-blue-600" />
        <StatCard title="Mean Time to Hire" value="18d" change="-2.4d" trend="up" icon={Timer} color="bg-violet-600" />
        <StatCard title="Conversion Efficiency" value="4.2%" change="-0.8%" trend="down" icon={Target} color="bg-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] relative">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-black text-xl text-slate-900">Application Velocity</h3>
              <p className="text-xs text-slate-400 font-medium">Inbound volume across all sectors</p>
            </div>
            <select className="bg-slate-50 border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer">
              <option>Last 7 Business Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700, fontSize: '12px'}}
                />
                <Area type="monotone" dataKey="apps" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorApps)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all"></div>
             <Sparkles className="text-indigo-400 mb-4" size={32} />
             <h3 className="text-xl font-black mb-2">Predictive Insight</h3>
             <p className="text-slate-400 text-sm font-medium leading-relaxed">
               Increasing your budget for <span className="text-white font-bold">Engineering</span> by 12% is likely to reduce your TTH by <span className="text-emerald-400 font-bold">5 days</span>.
             </p>
             <button className="mt-6 w-full py-3 bg-white text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
               Apply Recommendation
             </button>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem]">
            <h3 className="font-black text-lg mb-8 flex items-center gap-2">
              <Clock size={20} className="text-indigo-500" />
              Recent Stream
            </h3>
            <div className="space-y-6">
              {[
                { user: 'Sarah Chen', msg: 'Hired as Lead Frontend', time: '2h ago', color: 'bg-emerald-500' },
                { user: 'Mark Wilson', msg: 'AI Interview Completed', time: '4h ago', color: 'bg-indigo-500' },
                { user: 'Design System', msg: 'New Role Posted', time: '6h ago', color: 'bg-blue-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <div className={`mt-1.5 w-2 h-2 rounded-full ${item.color} group-hover:scale-150 transition-transform shadow-[0_0_8px_currentColor]`} />
                  <div>
                    <p className="text-xs font-black text-slate-900">{item.user}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{item.msg}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 uppercase font-black tracking-widest">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
