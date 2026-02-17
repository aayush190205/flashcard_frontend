import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "@clerk/clerk-react";
// Lucide Icons
import { 
  FileText, Flame, 
  MessageSquare, Zap, 
  Plus, Crown, ShieldCheck, Loader2, LogOut,
  Trash2
} from "lucide-react";

function Dashboard() {
  const { isDark } = useTheme();
  const { user } = useUser();
  const [time, setTime] = useState(new Date());
  
  // --- CONFIGURATION ---
  // Change VITE_API_URL to REACT_APP_API_URL if using Create React App
  // Defaulting to localhost if the .env variable isn't found
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000"; 
  
  // Data State
  const [documents, setDocuments] = useState([]);
  const [streak, setStreak] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Interaction State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);

  // 1. Fetch All Data (Docs + User Status)
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch Documents
        const docRes = await fetch(`${API_BASE}/api/pdf?clerkId=${user.id}`);
        const docData = await docRes.json();
        if (docData.success) setDocuments(docData.data);

        // Fetch User Status (Pro + Streak)
        const statusRes = await fetch(`${API_BASE}/api/user/status?clerkId=${user.id}`);
        const statusData = await statusRes.json();
        setIsPro(statusData.isPro);
        setStreak(statusData.streak || 0); 

      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [user, API_BASE]);

  // 2. Clock & Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // 3. Handle Upgrade (Mock)
  const handleUpgrade = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 800)); // Simulate network delay
    try {
        const res = await fetch(`${API_BASE}/api/user/upgrade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clerkId: user.id })
        });
        const data = await res.json();
        if (data.success) {
            setIsPro(true);
            alert("🎉 Welcome to Pro!");
        }
    } catch (error) { alert("Error upgrading"); } 
    finally { setProcessing(false); }
  };

  // 4. Handle Downgrade (Cancel)
  const handleDowngrade = async () => {
    if(!window.confirm("Are you sure? You will lose Pro features.")) return;
    setProcessing(true);
    try {
        const res = await fetch(`${API_BASE}/api/user/downgrade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clerkId: user.id })
        });
        const data = await res.json();
        if (data.success) {
            setIsPro(false);
            alert("Plan Cancelled. Reverted to Free Tier.");
        }
    } catch (error) { alert("Error cancelling"); } 
    finally { setProcessing(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await fetch(`${API_BASE}/api/pdf/${id}`, { method: 'DELETE' });
      setDocuments(prev => prev.filter(doc => doc._id !== id));
    } catch (err) { console.error(err); }
  };

  const currentSecond = time.getSeconds();
  const parallaxX = (mousePosition.x - window.innerWidth / 2) / 50;
  const parallaxY = (mousePosition.y - window.innerHeight / 2) / 50;

  return (
    <div className="space-y-6 pb-10 flex flex-col min-h-full font-sans transition-colors duration-500">
      
      {/* 1. HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[380px]">
        
        {/* CLOCK CARD */}
        <div className={`lg:col-span-2 relative overflow-hidden rounded-[2.5rem] border ${isDark ? 'border-white/10 bg-[#0a0a0f]' : 'border-slate-200 bg-white shadow-xl'} p-10 flex flex-col justify-center transition-all duration-300`}>
             <div className="absolute -inset-20 bg-emerald-500/[0.03] blur-[140px] rounded-full pointer-events-none" style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}></div>
             
             <div className="relative z-10">
                <div className="flex flex-col mb-6">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {getGreeting()}, {user?.firstName}
                    </p>
                    <p className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Ready to learn something new?
                    </p>
                </div>
                
                <h1 className={`relative text-7xl md:text-8xl font-black font-mono tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'} mb-10 tabular-nums`}>
                    {time.toLocaleTimeString('en-US', { hour12: false })}
                </h1>

                {/* Second Ticker */}
                <div className="relative h-4 w-full mb-6 perspective-[1000px]">
                    <div className="flex gap-[4px] h-full w-full rotateX-[45deg] transform-gpu">
                        {[...Array(60)].map((_, i) => (
                            <div key={i} className={`flex-1 rounded-sm transition-all duration-700 ease-out ${i <= currentSecond ? 'bg-emerald-500 opacity-100 shadow-[0_-4px_10px_rgba(16,185,129,0.5)]' : isDark ? 'bg-white/[0.03]' : 'bg-slate-200'}`} style={{ height: i === currentSecond ? '100%' : '60%', marginTop: i === currentSecond ? '0' : 'auto' }}></div>
                        ))}
                    </div>
                </div>
                <p className={`text-[11px] font-bold tracking-[0.2em] uppercase ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
             </div>
        </div>

        {/* STATS & SUBSCRIPTION MANAGEMENT */}
        <div className="lg:col-span-1 flex flex-col gap-4">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 flex-1">
                {/* Stat 1: Documents */}
                <StatBox icon={<FileText size={20} />} value={documents.length} label={isPro ? "Unlimited Docs" : "/5 Free PDFs"} color="blue" isDark={isDark} />
                
                {/* Stat 2: Streak (Dynamic) */}
                <StatBox icon={<Flame size={20} />} value={streak} label="Day Streak" color="orange" isDark={isDark} />
            </div>
            
            {/* ACTION CARD (Subscription) */}
            <div className={`flex-1 rounded-[2rem] border p-6 flex flex-col justify-between relative overflow-hidden ${isDark ? 'border-white/10 bg-[#0a0a0f]' : 'border-slate-200 bg-slate-900 text-white'}`}>
                {isPro ? (
                    // PRO VIEW: Active Status + Cancel Button
                    <>
                        <div className="z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldCheck className="text-emerald-400" size={32} />
                                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">Active</span>
                            </div>
                            <h3 className={`text-2xl font-black text-white`}>Pro Plan</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Unlimited Access Unlocked</p>
                        </div>
                        
                        <button 
                            onClick={handleDowngrade} 
                            disabled={processing}
                            className="z-10 mt-2 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 text-left flex items-center gap-2 transition-colors opacity-80 hover:opacity-100"
                        >
                            <LogOut size={12} /> Cancel Subscription
                        </button>
                    </>
                ) : (
                    // FREE VIEW: Upgrade Prompt
                    <>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                          <div className="z-10">
                            <Crown className="text-yellow-400 mb-2" size={32} />
                            <h3 className={`text-xl font-bold text-white`}>Upgrade to Pro</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Unlock Unlimited AI & Uploads</p>
                        </div>
                        <button 
                            onClick={handleUpgrade} 
                            disabled={processing}
                            className="z-10 mt-4 w-full py-3 bg-yellow-400 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? <Loader2 className="animate-spin" size={14}/> : <Zap size={14} fill="currentColor"/>}
                            Simulate Upgrade
                        </button>
                    </>
                )}
            </div>
        </div>
      </div>

      {/* 2. BENTO GRID (LIBRARY & TOOLS) */}
      <div className="grid grid-cols-12 gap-6 auto-rows-[220px]">
          {/* LIBRARY */}
          <div className={`col-span-12 md:col-span-7 row-span-2 rounded-[2.5rem] border overflow-hidden ${isDark ? 'border-white/10 bg-[#0a0a0f]' : 'border-slate-200 bg-white shadow-xl'} flex flex-col`}>
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Library</h3>
                <Link 
                    to={!isPro && documents.length >= 5 ? "#" : "/upload-pdf"} 
                    className={`px-5 py-2.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${!isPro && documents.length >= 5 ? 'bg-slate-500 cursor-not-allowed opacity-50' : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'}`}
                >
                    <Plus size={14} /> New PDF
                </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {loading ? (
                    <div className="h-full flex items-center justify-center italic text-slate-500 text-sm">Syncing...</div>
                ) : documents.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                        <FileText size={48} strokeWidth={1.5} className="mb-3" />
                        <p className="font-bold text-xs uppercase tracking-widest">No files</p>
                    </div>
                ) : (
                    documents.map(doc => (
                        <div key={doc._id} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${isDark ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]' : 'border-slate-100 bg-slate-50 shadow-sm'}`}>
                            <div className="flex items-center gap-4 truncate">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                                  <FileText size={18} className="text-emerald-500" />
                                </div>
                                <div className="truncate">
                                    <p className={`font-bold text-sm truncate max-w-[200px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{doc.title}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Added {new Date(doc.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(doc._id)} className="p-2 text-slate-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                              <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
          </div>

          {/* AI TOOLS LINKS */}
          <Link to="/chatbot" className={`col-span-12 md:col-span-5 row-span-1 rounded-[2.5rem] border p-10 flex items-center justify-between group transition-all ${isDark ? 'border-white/10 bg-[#0a0a0f] hover:bg-emerald-500/[0.02]' : 'border-slate-200 bg-white hover:bg-slate-50 shadow-xl'}`}>
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>AI Tutor</h3>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Chat with your documents.</p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Launch →</div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <MessageSquare size={28} />
            </div>
          </Link>

          <Link to="/flashcards" className={`col-span-12 md:col-span-5 row-span-1 rounded-[2.5rem] border p-10 flex items-center justify-between group transition-all ${isDark ? 'border-white/10 bg-[#0a0a0f] hover:bg-purple-500/[0.02]' : 'border-slate-200 bg-white hover:bg-slate-50 shadow-xl'}`}>
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>Flashcards</h3>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Generated Study Decks.</p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-500">Practice →</div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-purple-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Zap size={28} />
            </div>
          </Link>
      </div>

      <footer className="mt-auto pt-8 text-center">
        <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDark ? 'text-slate-700' : 'text-slate-400'}`}>
            StudyFlow AI • {isPro ? "PRO LICENSE" : "FREE TIER"}
        </p>
      </footer>
    </div>
  );
}

function StatBox({ icon, value, label, color, isDark }) {
    const colors = { 
        blue: "text-blue-500 bg-blue-500/10", 
        orange: "text-orange-500 bg-orange-500/10", 
        purple: "text-purple-500 bg-purple-500/10" 
    };
    return (
        <div className={`rounded-[2rem] border ${isDark ? 'border-white/10 bg-[#0a0a0f]' : 'border-slate-200 bg-white shadow-md'} p-5 flex flex-col justify-between transition-transform hover:scale-[1.02]`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colors[color]}`}>{icon}</div>
            <div>
                <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tabular-nums`}>{value}</h3>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
            </div>
        </div>
    );
}

export default Dashboard;