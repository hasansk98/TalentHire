
import React, { useState } from 'react';
import { Calendar, Clock, User, Video, Bot, ChevronRight, MoreVertical, Plus, Sparkles, Loader2, X, Check } from 'lucide-react';
import { INITIAL_CANDIDATES } from '../constants';

const InterviewCard = ({ candidate, time, type, status }: any) => (
  <div className="bg-white border border-slate-200 p-5 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          {candidate.charAt(0)}
        </div>
        <div>
          <h4 className="font-black text-sm text-slate-900">{candidate}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{type} Session</p>
        </div>
      </div>
      <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={16} /></button>
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
        <Calendar size={14} className="text-indigo-500" /> {time.date}
      </div>
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
        <Clock size={14} className="text-indigo-500" /> {time.slot}
      </div>
    </div>
    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
        status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
      }`}>
        {status}
      </span>
      <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
        Launch <ChevronRight size={14} />
      </button>
    </div>
  </div>
);

const SchedulingModal = ({ isOpen, onClose, onSchedule }: any) => {
  const [candidateId, setCandidateId] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [type, setType] = useState('LIVE');

  if (!isOpen) return null;

  const handleSuggest = async () => {
    setIsSuggesting(true);
    // Simulate AI Suggestion Call
    setTimeout(() => {
      const now = new Date();
      const slots = [
        new Date(now.getTime() + 86400000).toISOString(),
        new Date(now.getTime() + 86400000 * 1.5).toISOString(),
        new Date(now.getTime() + 86400000 * 2).toISOString(),
      ];
      setSuggestions(slots);
      setIsSuggesting(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (!candidateId || !selectedSlot) return;
    onSchedule({ candidateId, scheduledAt: selectedSlot, type });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI-Assisted Scheduling</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Coordinate Talent Interaction</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Candidate Identifier</label>
            <select 
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-500 font-bold text-sm"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
            >
              <option value="">Select Candidate...</option>
              {INITIAL_CANDIDATES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Assessment Type</label>
            <div className="grid grid-cols-3 gap-3">
              {['AI_CHAT', 'VIDEO', 'LIVE'].map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    type === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Scheduling Directives (AI Input)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Next week afternoons only..." 
                className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-500 font-bold text-sm"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              />
              <button 
                onClick={handleSuggest}
                disabled={isSuggesting}
                className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
              >
                {isSuggesting ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              </button>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-2">AI Optimal Slots Found</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      selectedSlot === s ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedSlot === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Calendar size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-slate-900">{new Date(s).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(s).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    {selectedSlot === s && <Check size={16} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <button 
            disabled={!selectedSlot || !candidateId}
            onClick={handleSubmit}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            Provision Interview Instance
          </button>
        </div>
      </div>
    </div>
  );
};

const InterviewsView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviews, setInterviews] = useState([
    { candidate: "Marcus Thorne", type: "AI_BOT", time: {date: 'Feb 24, 2024', slot: '10:00 AM PST'}, status: "CONFIRMED" },
    { candidate: "Elena Rodriguez", type: "VIDEO", time: {date: 'Feb 24, 2024', slot: '02:30 PM PST'}, status: "PENDING" },
    { candidate: "Julian Vane", type: "AI_BOT", time: {date: 'Feb 25, 2024', slot: '09:00 AM PST'}, status: "CONFIRMED" },
    { candidate: "Sofia Kim", type: "LIVE", time: {date: 'Feb 25, 2024', slot: '11:15 AM PST'}, status: "CONFIRMED" },
  ]);

  const handleSchedule = (data: any) => {
    const candidate = INITIAL_CANDIDATES.find(c => c.id === data.candidateId);
    const date = new Date(data.scheduledAt);
    const newInterview = {
      candidate: candidate?.name || "Unknown Candidate",
      type: data.type,
      time: {
        date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        slot: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) + ' PST'
      },
      status: "CONFIRMED"
    };
    setInterviews([newInterview, ...interviews]);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Interview Deck</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Coordinate AI assessments and live panel discussions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
        >
          <Plus size={16} /> New Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {interviews.map((int, i) => (
          <InterviewCard key={i} {...int} />
        ))}
      </div>

      <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-10 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg">
          <Calendar size={32} className="text-slate-300" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">Calendar Integration</h3>
          <p className="text-slate-500 text-sm max-w-sm mt-2 mx-auto font-medium">
            Connect your Google or Outlook calendar to automate conflict detection and slot management.
          </p>
        </div>
        <button className="bg-white border border-slate-200 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          Link External Calendar
        </button>
      </div>

      <SchedulingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSchedule={handleSchedule}
      />
    </div>
  );
};

export default InterviewsView;
