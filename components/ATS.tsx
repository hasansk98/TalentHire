
import React, { useState, useRef } from 'react';
import { 
  Search, Filter, MoreVertical, Brain, AlertCircle, TrendingUp, 
  Mail, Calendar, ChevronRight, Loader2, Sparkles, Upload,
  LayoutGrid, List, GripVertical
} from 'lucide-react';
import { 
  DragDropContext, Droppable, Draggable, DropResult, 
  DroppableProvided, DroppableStateSnapshot, 
  DraggableProvided, DraggableStateSnapshot 
} from '@hello-pangea/dnd';
import { INITIAL_CANDIDATES, INITIAL_JOBS } from '../constants';
import { CandidateStatus, Candidate } from '../types';
import { performAIScreening } from '../services/geminiService';

const StatusBadge = ({ status }: { status: CandidateStatus }) => {
  const colors: Record<CandidateStatus, string> = {
    [CandidateStatus.NEW]: 'bg-blue-100/50 text-blue-700 border-blue-200',
    [CandidateStatus.SCREENING]: 'bg-amber-100/50 text-amber-700 border-amber-200',
    [CandidateStatus.INTERVIEWING]: 'bg-indigo-100/50 text-indigo-700 border-indigo-200',
    [CandidateStatus.OFFER]: 'bg-violet-100/50 text-violet-700 border-violet-200',
    [CandidateStatus.HIRED]: 'bg-emerald-100/50 text-emerald-700 border-emerald-200',
    [CandidateStatus.REJECTED]: 'bg-slate-100/50 text-slate-500 border-slate-200',
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${colors[status]}`}>
      {status}
    </span>
  );
};

const ATSView = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as CandidateStatus;
    const candidateId = draggableId;

    // Optimistic update
    const updatedCandidates = candidates.map(can => 
      can.id === candidateId ? { ...can, status: newStatus, lastActivity: 'Just now' } : can
    );
    setCandidates(updatedCandidates);

    // Simulate backend update
    console.log(`Updating candidate ${candidateId} status to ${newStatus}`);
    // In a real app: await apiClient.patch(`/candidates/${candidateId}`, { status: newStatus });
  };

  const handleRefreshRanking = async () => {
    setIsRefreshing(true);
    setShowConfirmation(false);
    try {
      const job = INITIAL_JOBS[0]; // Using first job as context
      const updatedCandidates = await Promise.all(candidates.map(async (can) => {
        // In a real app, we'd fetch the resume text from can.resumeUrl
        // For this demo, we'll simulate it with a prompt
        const mockResumeText = `Resume of ${can.name}. Skills: ${can.skills.join(', ')}. Experience: 5 years in software development.`;
        
        const analysis = await performAIScreening(mockResumeText, job.description);
        
        return {
          ...can,
          aiScore: analysis.overallScore,
          fraudRiskScore: analysis.fraudRiskScore,
          skills: analysis.skillsMatch,
          resume_metadata: analysis,
          mlRanking: analysis.overallScore / 100 // Simple mapping for demo
        };
      }));
      setCandidates(updatedCandidates);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (error) {
      console.error("AI Screening failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRefreshing(true);
    try {
      // Simulate reading file and screening
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const job = INITIAL_JOBS[0];
        
        const analysis = await performAIScreening(text || "New candidate resume content", job.description);
        
        const newCandidate: Candidate = {
          id: `can-${Date.now()}`,
          jobId: job.id,
          name: file.name.split('.')[0],
          email: `${file.name.split('.')[0].toLowerCase()}@example.com`,
          status: CandidateStatus.NEW,
          resumeUrl: URL.createObjectURL(file),
          aiScore: analysis.overallScore,
          fraudRiskScore: analysis.fraudRiskScore,
          mlRanking: analysis.overallScore / 100,
          skills: analysis.skillsMatch,
          lastActivity: 'Just now',
          resume_metadata: analysis,
          companyId: job.companyId
        };

        setCandidates(prev => [newCandidate, ...prev]);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Upload screening failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Talent Pipeline</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Advanced management of active recruitment streams.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl mr-2">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'board' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          {showConfirmation && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-4">
              <Sparkles size={14} />
              Ranking Synchronized
            </div>
          )}
          <button 
            onClick={handleRefreshRanking}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all disabled:opacity-50"
          >
            {isRefreshing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isRefreshing ? 'Optimizing Weights' : 'Recalculate Ranking'}
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all"
          >
            <Upload size={16} />
            Upload Resume
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".txt,.pdf,.doc,.docx"
          />
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all">
            <Mail size={16} />
            Bulk Actions
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="glass-card rounded-[2.5rem] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-6">
              <div className="flex bg-slate-200/50 p-1 rounded-xl">
                {['All', 'Active', 'Interviewing', 'Offers'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSelectedStatus(tab)}
                    className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                      selectedStatus === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">ML Service Online</span>
               </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5">Entity Identifier</th>
                  <th className="px-6 py-5 text-center">Phase</th>
                  <th className="px-6 py-5">AI Screening Index</th>
                  <th className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      Neural Ranking <TrendingUp size={12} />
                    </div>
                  </th>
                  <th className="px-6 py-5">Integrity Risk</th>
                  <th className="px-6 py-5">Updated</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((can) => (
                  <tr key={can.id} className="hover:bg-indigo-50/30 transition-all group cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:from-indigo-600 group-hover:to-indigo-500 group-hover:text-white transition-all shadow-sm">
                          {can.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">{can.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{can.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <StatusBadge status={can.status} />
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                          <svg className="w-12 h-12 transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100" />
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={125} strokeDashoffset={125 - (125 * can.aiScore) / 100} className="text-indigo-600" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-900 tabular-nums">{can.aiScore}</span>
                        </div>
                        <Brain size={14} className="text-indigo-400 group-hover:animate-pulse" />
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`flex flex-col gap-1 ${isRefreshing ? 'animate-pulse' : ''}`}>
                        <div className="flex items-center gap-2 font-black text-base text-slate-900 tabular-nums">
                          {(can.mlRanking * 100).toFixed(1)}%
                        </div>
                        <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                            style={{ width: `${can.mlRanking * 100}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {can.fraudRiskScore > 10 ? (
                        <div className="flex items-center gap-1.5 text-rose-600 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 bg-rose-50 rounded-lg border border-rose-100">
                          <AlertCircle size={14} />
                          Warning ({can.fraudRiskScore}%)
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Minimal Risk</span>
                      )}
                    </td>
                    <td className="px-6 py-6 text-[11px] text-slate-500 font-bold tabular-nums">
                      {can.lastActivity}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                          <MoreVertical size={18} />
                        </button>
                        <ChevronRight size={16} className="text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px]">
            {Object.values(CandidateStatus).map((status) => (
              <div key={status} className="flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{status}</h3>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full">
                      {candidates.filter(c => c.status === status).length}
                    </span>
                  </div>
                  <MoreVertical size={14} className="text-slate-400" />
                </div>
                
                <Droppable droppableId={status}>
                  {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-4 min-h-[500px] p-2 rounded-3xl transition-colors ${
                        snapshot.isDraggingOver ? 'bg-indigo-50/50 ring-2 ring-indigo-200 ring-inset' : 'bg-slate-100/30'
                      }`}
                    >
                      {candidates
                        .filter(c => c.status === status)
                        .map((can, index) => (
                          // @ts-ignore - key is required by React but not in DraggableProps interface in some versions
                          <Draggable key={can.id} draggableId={can.id} index={index}>
                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`glass-card p-5 rounded-2xl group cursor-grab active:cursor-grabbing transition-all ${
                                  snapshot.isDragging ? 'shadow-2xl ring-2 ring-indigo-500 scale-105 z-50' : 'hover:border-indigo-200'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                      {can.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-black text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">{can.name}</p>
                                      <p className="text-[10px] text-slate-400 font-medium">{can.email}</p>
                                    </div>
                                  </div>
                                  <GripVertical size={14} className="text-slate-300 group-hover:text-slate-400" />
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-[10px] font-black text-indigo-600">
                                      <Brain size={12} />
                                      {can.aiScore}
                                    </div>
                                    <div className="w-px h-3 bg-slate-200"></div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                      {(can.mlRanking * 100).toFixed(0)}% Match
                                    </div>
                                  </div>
                                  <div className="text-[9px] font-bold text-slate-400 uppercase">
                                    {can.lastActivity}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default ATSView;
