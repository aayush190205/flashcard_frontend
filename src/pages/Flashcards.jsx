import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, RotateCcw, ArrowRight, Loader2, 
  BrainCircuit, Layers, Check, X 
} from "lucide-react";

const Flashcards = () => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  
  // HARDCODED FOR DEMO RELIABILITY
  const API_BASE = "https://ai-flashcard-backend-j20a.onrender.com";

  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRemediating, setIsRemediating] = useState(false);
  const [direction, setDirection] = useState(0); 

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
  }, [user]);

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

  const handleKnown = (e) => {
      e.stopPropagation();
      handleNext();
  };

  const handleNotKnown = async (e) => {
      e.stopPropagation(); 
      if (isRemediating) return;
      setIsRemediating(true);
      
      try {
          const currentCard = flashcards[currentIndex];
          const res = await fetch(`${API_BASE}/api/flashcards/remediate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  front: currentCard.front, 
                  back: currentCard.back, 
                  documentId: selectedDocId 
              })
          });
          const data = await res.json();
          
          if (data.success && data.flashcards.length > 0) {
              const newCards = [...flashcards];
              newCards.splice(currentIndex + 1, 0, ...data.flashcards);
              setFlashcards(newCards);
              handleNext();
          }
      } catch(err) {
          console.error("Remediation Error:", err);
      } finally {
          setIsRemediating(false);
      }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0, scale: 0.8, zIndex: 0, rotate: direction > 0 ? 10 : -10
    }),
    center: {
      x: 0, opacity: 1, scale: 1, zIndex: 1, rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0, scale: 0.8, zIndex: 0, rotate: direction > 0 ? -10 : 10,
      transition: { duration: 0.2 }
    })
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-3rem)] w-full overflow-hidden font-sans relative ${isDark ? 'bg-[#0B0C15]' : 'bg-slate-50'}`}>
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

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {flashcards.length > 0 && !loading ? (
            <div className="relative w-full max-w-xl aspect-[3/2] perspective-1000">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex} custom={direction} variants={variants}
                        initial="enter" animate="center" exit="exit"
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <motion.div className={`relative w-full h-full rounded-[2rem] shadow-2xl transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                            <div className={`absolute inset-0 backface-hidden rounded-[2rem] border flex flex-col items-center justify-center p-12 text-center ${isDark ? 'bg-[#15151A] border-white/10' : 'bg-white border-slate-100'}`}>
                                {flashcards[currentIndex].isRemediation && (
                                    <span className="absolute top-6 right-6 px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                                        <Zap size={10} fill="currentColor"/> Foundational Hint
                                    </span>
                                )}
                                <span className="mb-6 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest">Question</span>
                                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {flashcards[currentIndex].front}
                                </h3>
                            </div>

                            <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-indigo-600 to-violet-700 text-white`}>
                                <span className="mb-6 px-4 py-1.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest">Answer</span>
                                <p className="text-xl font-medium leading-relaxed mb-8">
                                    {flashcards[currentIndex].back}
                                </p>
                                <div className="absolute bottom-8 w-full px-8 flex justify-between gap-4">
                                    <button onClick={handleNotKnown} disabled={isRemediating} className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-red-500 hover:border-red-400 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                        {isRemediating ? <Loader2 className="animate-spin" size={16}/> : <X size={16}/>} Not Known
                                    </button>
                                    <button onClick={handleKnown} className="flex-1 py-3 rounded-xl bg-white/20 border border-white/30 hover:bg-emerald-500 hover:border-emerald-400 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                        <Check size={16}/> Known
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        ) : (
            <div className="text-center z-10">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-[2rem] flex items-center justify-center ${isDark ? 'bg-white/5 text-slate-500' : 'bg-white text-slate-300 shadow-xl'}`}>
                    <Layers size={48} strokeWidth={1} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {loading ? "Analyzing Document..." : "Flashcard Generator"}
                </h3>
            </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;