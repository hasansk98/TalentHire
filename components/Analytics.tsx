
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { Brain, TrendingUp, Users, Target } from 'lucide-react';

const funnelData = [
  { name: 'Sourced', count: 1200 },
  { name: 'Applied', count: 850 },
  { name: 'AI Score > 80', count: 210 },
  { name: 'Interviews', count: 45 },
  { name: 'Offers', count: 8 },
  { name: 'Hires', count: 6 },
];

const sourceData = [
  { name: 'LinkedIn', value: 450 },
  { name: 'Referrals', value: 120 },
  { name: 'Career Site', value: 280 },
  { name: 'Agency', value: 40 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

const AnalyticsView = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Talent Intelligence</h2>
        <p className="text-slate-500">ML-driven insights into your recruitment performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Diversity & Inclusion</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">
              <TrendingUp size={16} /> Improving
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Hiring Funnel (All Jobs)</h3>
            <Target className="text-slate-400" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
        
        <div className="relative z-10 flex items-center gap-12">
          <div className="w-24 h-24 bg-white/10 rounded-3xl backdrop-blur flex items-center justify-center">
            <Brain size={48} className="text-indigo-400" />
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-3xl font-black">Predictive Hiring Insights</h3>
            <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
              Our ML engine predicts that increasing your "Product Design" sourcing budget by 15% would likely decrease your time-to-hire by 4 days in the next quarter.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-indigo-600 px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all">Generate Full AI Report</button>
              <button className="bg-white/10 border border-white/20 px-8 py-3 rounded-2xl font-bold hover:bg-white/20 transition-all">Optimize Strategy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
