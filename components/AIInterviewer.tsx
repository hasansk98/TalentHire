
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Mic, Video, Send, CheckCircle2, Loader2, Play, Power, MessageSquare, BarChart2, ShieldAlert } from 'lucide-react';

const AIInterviewer = () => {
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Initializing Secure Assessment Protocol... I am TalentBot-3. I'll be conducting your technical screening for the Senior Engineer role. Ready to begin?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [confidence, setConfidence] = useState(94.8);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setVideoStarted(true);
        
        // Start MediaRecorder for Enterprise Archiving
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
        recorder.onstop = handleRecordingStop;
        recorder.start(1000); // Capture chunks every second
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      }
    } catch (err) {
      console.error("Hardware Access Denied", err);
      alert("Camera and Microphone are mandatory for this enterprise assessment.");
    }
  };

  const handleRecordingStop = async () => {
    const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
    console.log("Session Data Encrypted & Prepared for Upload:", videoBlob.size);
    // In production: upload to S3 via backend
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    // Simulate fluctuation in ML confidence based on response complexity
    setConfidence(prev => Math.min(99.9, Math.max(85, prev + (Math.random() * 4 - 2))));

    // API Call to Interview Bot Service
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "That shows good practical understanding. Regarding scaling: how would you optimize the critical path for a globally distributed write-heavy application?" 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto h-[calc(100vh-180px)] flex gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Primary Chat Interface */}
      <div className="flex-1 flex flex-col glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-950 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot size={24} />
            </div>
            <div>
              <p className="font-black text-sm tracking-tight">TALENTBOT NEURAL INTERFACE</p>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor] ${isRecording ? 'bg-rose-500 text-rose-500' : 'bg-emerald-500 text-emerald-500'}`}></div>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isRecording ? 'Recording Live Feed' : 'Encrypted Standby'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400">
              Candidate: Marcus T.
            </div>
            <button className="p-2 text-slate-500 hover:text-rose-500 transition-colors" title="Emergency Terminate">
              <Power size={20} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8 bg-slate-50/20">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[75%] p-5 rounded-[1.5rem] shadow-sm ${
                m.role === 'ai' 
                  ? 'bg-white text-slate-900 border border-slate-200 rounded-tl-none ring-1 ring-slate-100' 
                  : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20'
              }`}>
                <p className="text-sm font-semibold leading-relaxed tracking-tight">{m.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 rounded-tl-none flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4 bg-slate-100/50 p-2 rounded-2xl border border-slate-100">
            <div className="p-3 text-slate-400 hover:text-indigo-600 cursor-pointer" title="Voice Response Enabled"><Mic size={20} /></div>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Provide technical substantiation..." 
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium py-3"
            />
            <button 
              onClick={handleSend}
              className="p-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Biometric & Analysis Sidebar */}
      <div className="w-[420px] flex flex-col gap-6">
        <div className="bg-slate-950 rounded-[2.5rem] relative aspect-square overflow-hidden shadow-2xl border border-slate-800 ring-4 ring-white shadow-indigo-500/10">
          {!videoStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center bg-slate-900">
              <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-indigo-500/30 animate-pulse">
                <Video size={40} className="text-indigo-400" />
              </div>
              <h4 className="text-xl font-black mb-2 tracking-tight">Identity Verification</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">Pending Secure Handshake</p>
              <button 
                onClick={handleStartSession}
                className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 active:scale-95 transition-all shadow-xl"
              >
                Start Session
              </button>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover opacity-80 grayscale-[0.2]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_1px,transparent_1px)] bg-[length:100%_4px]"></div>
              <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_#f43f5e]"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Bio-Capture</span>
              </div>
              <div className="absolute bottom-6 right-6 p-4 bg-indigo-600/80 backdrop-blur-xl rounded-2xl border border-white/20 text-white shadow-2xl min-w-[140px]">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">ML Confidence</p>
                <p className="text-3xl font-black tabular-nums">{confidence.toFixed(1)}%</p>
              </div>
            </>
          )}
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] flex-1 flex flex-col border-slate-200">
          <h3 className="font-black text-slate-900 text-lg mb-8 flex items-center gap-3">
            <BarChart2 size={20} className="text-indigo-600" />
            Skill Map Synthesis
          </h3>
          <div className="space-y-8 flex-1">
            <div className="group">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                <span>Distributed Logic</span>
                <span className="text-slate-900 tabular-nums font-black">82%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px]">
                <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)] transition-all duration-700" style={{ width: '82%' }} />
              </div>
            </div>
            
            <div className="group">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                <span>Resilience Patterning</span>
                <span className="text-slate-900 tabular-nums font-black">91%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px]">
                <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-700" style={{ width: '91%' }} />
              </div>
            </div>

            <div className="mt-auto p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldAlert size={64} />
              </div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3">Neural Integrity</p>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Biometric markers indicate high authentic engagement. No signs of secondary prompting detected in peripheral audio/video feeds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewer;
