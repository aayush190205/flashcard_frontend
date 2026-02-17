import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, RotateCcw, ArrowRight, Loader2, 
  BrainCircuit, Layers
} from "lucide-react";

const Flashcards = () => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  
  // --- CONFIGURATION ---
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(0); // For slide direction

  // 1. Fetch Docs
  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/api/pdf?clerkId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setDocuments(data.data);
          setSelectedDocId(data.data[0]._id);
        }
      });
  }, [user, API_BASE]);

  // 2. Generate
  const generateCards = async () => {
    setLoading(true); setFlashcards([]); setIsFlipped(false); setCurrentIndex(0);
    try {
        const res = await fetch(`${API_BASE}/api/flashcards/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentId: selectedDocId })
        });
        const data = await res.json();
        if (data.success) setFlashcards(data.flashcards);
    } catch(e) { console.error(e); } 
    finally { setLoading(false); }
  };

  // 3. Navigation (Slide Logic)
  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Animation Variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      zIndex: 0,
      rotate: direction > 0 ? 10 : -10
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      zIndex: 0,
      rotate: direction > 0 ? -10 : 10,
      transition: { duration: 0.2 }
    })
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-3rem)] w-full overflow-hidden font-sans relative ${isDark ? 'bg-[#0B0C15]' : 'bg-slate-50'}`}>
      
      {/* HEADER */}
      <div className={`px-8 py-5 flex items-center justify-between border-b shrink-0 z-20 ${isDark ? 'bg-[#0B0C15] border-white/5' : 'bg-white border-slate-200'}`}>
         <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white text-indigo-600 shadow-indigo-100'}`}>
                <BrainCircuit size={24} />
            </div>
            <div>
                <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Flashcards</h1>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    {flashcards.length > 0 ? `${currentIndex + 1} / ${flashcards.length}` : 'AI Generator'}
                </p>
            </div>
         </div>
         <div className="flex gap-3">
            <select value={selectedDocId} onChange={(e) => setSelectedDocId(e.target.value)} className={`pl-4 pr-10 py-3 rounded-xl text-xs font-bold outline-none cursor-pointer border transition-all ${isDark ? 'bg-white/5 text-white border-white/10' : 'bg-white text-slate-700 border-slate-200'}`}>
                {documents.map(d => <option key={d._id} value={d._id}>{d.title}</option>)}
            </select>
            <button onClick={generateCards} disabled={loading || !selectedDocId} className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} fill="currentColor" />} 
                Generate
            </button>
         </div>
      </div>

      {/* CARD STACK AREA */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {flashcards.length > 0 && !loading ? (
            <div className="relative w-full max-w-xl aspect-[3/2] perspective-1000">
                
                {/* STACK VISUALIZATION (The cards behind) */}
                {currentIndex < flashcards.length - 1 && (
                    <div className={`absolute top-4 left-4 right-4 bottom-0 rounded-[2rem] opacity-40 scale-[0.95] -z-10 transition-all ${isDark ? 'bg-white/5 border border-white/5' : 'bg-white border-slate-200 shadow-md'}`}></div>
                )}
                {currentIndex < flashcards.length - 2 && (
                    <div className={`absolute top-8 left-8 right-8 bottom-0 rounded-[2rem] opacity-20 scale-[0.90] -z-20 transition-all ${isDark ? 'bg-white/5 border border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}></div>
                )}

                {/* ACTIVE CARD (Animated) */}
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* CARD CONTENT */}
                        <motion.div 
                            className={`relative w-full h-full rounded-[2rem] shadow-2xl transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                        >
                            {/* FRONT */}
                            <div className={`absolute inset-0 backface-hidden rounded-[2rem] border flex flex-col items-center justify-center p-12 text-center ${isDark ? 'bg-[#15151A] border-white/10' : 'bg-white border-white'}`}>
                                <span className="mb-6 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest">Question</span>
                                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {flashcards[currentIndex].front}
                                </h3>
                                <div className="absolute bottom-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 animate-pulse">
                                    <RotateCcw size={12} /> Tap to Flip
                                </div>
                            </div>

                            {/* BACK */}
                            <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-indigo-600 to-violet-700 text-white`}>
                                <span className="mb-6 px-4 py-1.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest">Answer</span>
                                <p className="text-xl font-medium leading-relaxed">
                                    {flashcards[currentIndex].back}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

            </div>
        ) : (
            // EMPTY STATE
            <div className="text-center animate-in zoom-in-95 duration-500 z-10">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-[2rem] flex items-center justify-center ${isDark ? 'bg-white/5 text-slate-500' : 'bg-white text-slate-300 shadow-xl'}`}>
                    <Layers size={48} strokeWidth={1} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {loading ? "Building Deck..." : "Flashcard Generator"}
                </h3>
                <p className={`text-sm font-medium mb-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Select a document to create an interactive study deck.
                </p>
            </div>
        )}

        {/* CONTROLS (Bottom) */}
        {flashcards.length > 0 && !loading && (
            <div className="absolute bottom-12 flex gap-4 z-10">
                <button onClick={handlePrev} disabled={currentIndex === 0} className={`p-4 rounded-full border transition-all hover:scale-110 active:scale-95 ${isDark ? 'bg-gray-800 border-gray-700 text-white disabled:opacity-30' : 'bg-white border-slate-200 text-slate-700 shadow-lg disabled:opacity-30'}`}>
                    <ArrowRight size={24} className="rotate-180"/>
                </button>
                <button onClick={handleNext} disabled={currentIndex === flashcards.length - 1} className={`px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2`}>
                    Next Card <ArrowRight size={16} />
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default Flashcards;