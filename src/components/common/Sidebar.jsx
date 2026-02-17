import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Zap, 
  Moon, 
  Sun, 
  ShieldCheck 
} from "lucide-react";

const Sidebar = () => {
  const { isDark, setIsDark } = useTheme();
  const location = useLocation();
  const { user } = useUser();
  const [isPro, setIsPro] = useState(false);
  
  // --- CONFIGURATION ---
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 1. Fetch Real Subscription Status
  useEffect(() => {
    if (!user) return;
    const checkStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/user/status?clerkId=${user.id}`);
            const data = await res.json();
            setIsPro(data.isPro);
        } catch (e) {
            console.error("Sidebar Status Check Failed", e);
        }
    };
    checkStatus();
  }, [user, API_BASE]);

  // Navigation Items
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/upload-pdf", label: "Documents", icon: <FileText size={20} /> },
    { path: "/chatbot", label: "AI Tutor", icon: <MessageSquare size={20} /> },
    { path: "/flashcards", label: "Flashcards", icon: <Zap size={20} /> },
  ];

  return (
    <div className={`h-full flex flex-col justify-between transition-all duration-300 font-sans border-r ${
      isDark ? "bg-[#0B0C15] border-white/5" : "bg-white border-slate-100"
    }`}>
      
      {/* TOP SECTION */}
      <div className="p-6 space-y-8">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group px-2">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
             <span className="font-bold text-lg">SF</span>
             <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div>
            <h1 className={`font-bold text-lg tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              StudyFlow
            </h1>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                AI Workspace
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group overflow-hidden ${
                  isActive 
                    ? "text-emerald-500 font-semibold bg-emerald-500/10" 
                    : `text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 ${isDark ? "hover:text-slate-300" : "hover:text-slate-900"}`
                }`}
              >
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full"></div>
                )}
                <span className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className={`p-5 m-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
        
        {/* User Info */}
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="ring-2 ring-white dark:ring-white/10 rounded-full">
                    <UserButton afterSignOutUrl="/" />
                </div>
                <div className="flex flex-col min-w-0">
                    <p className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                        {user?.firstName || "Student"}
                    </p>
                    
                    {/* Dynamic Badge */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                        {isPro ? (
                             <>
                                <ShieldCheck size={10} className="text-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500">Pro Plan</span>
                             </>
                        ) : (
                             <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Free Tier</span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Theme Toggle Button */}
        <button
            onClick={() => setIsDark((prev) => !prev)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                isDark 
                ? "bg-black/20 text-slate-400 hover:text-white hover:bg-black/40" 
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700 shadow-sm"
            }`}
        >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;