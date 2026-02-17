import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";

function Login() {
  const [isDark, setIsDark] = useState(true);
  const [terminalLines, setTerminalLines] = useState([
    { text: "> INITIALIZING ENGINE...", color: isDark ? "text-emerald-500" : "text-emerald-600" },
  ]);

  // 1. EXACT 5-LINE SEQUENCE
  useEffect(() => {
    setTerminalLines([{ text: "> INITIALIZING ENGINE...", color: isDark ? "text-emerald-500" : "text-emerald-600" }]);

    const sequence = [
      { text: "> DETECTING PDF INPUT...", color: "text-blue-400" },
      { text: "> GENERATING STUDY MATERIAL... [OK]", color: isDark ? "text-emerald-500" : "text-emerald-600" },
      { text: "> SYSTEM READY.", color: isDark ? "text-white" : "text-slate-800" },
      { text: "> AWAITING USER CREDENTIALS...", color: "text-emerald-500 animate-pulse" }
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < sequence.length) {
        const newLine = sequence[currentIndex];
        if (newLine) {
           setTerminalLines((prev) => [...prev, newLine]);
        }
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isDark]);

  return (
    // FIX: 'fixed inset-0' locks the div to the viewport, preventing scroll completely
    <div className={`fixed inset-0 flex flex-col h-screen w-screen font-sans overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#020203] text-white" : "bg-gray-50 text-slate-900"}`}>
      
      {/* FONTS & CSS OVERRIDES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-tech { font-family: 'Space Grotesk', sans-serif; }
        .font-code { font-family: 'JetBrains Mono', monospace; }
        
        /* HIDE CLERK BRANDING & BADGES */
        .cl-footer-branding, 
        .cl-internal-b3fm6y, 
        .cl-internal-1nl00vr,
        .cl-badge,
        .cl-development-badge { 
            display: none !important; 
        }
      `}</style>

      {/* 1. PROFESSIONAL GRID BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className={`absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-500 ${isDark ? "bg-emerald-900/10" : "bg-emerald-200/40"}`}></div>
         <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-500 ${isDark ? "bg-blue-900/10" : "bg-blue-200/40"}`}></div>
         
         <div 
            className={`absolute inset-0 transition-opacity duration-500 ${isDark ? "opacity-[0.03]" : "opacity-[0.05]"}`}
            style={{
                backgroundImage: `linear-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }}
         ></div>
      </div>

      {/* THEME TOGGLE */}
      <button 
        onClick={() => setIsDark(!isDark)}
        className={`absolute top-6 right-6 z-50 p-2.5 rounded-full transition-all duration-300 border ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"}`}
      >
        {isDark ? (
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ) : (
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        )}
      </button>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex w-full h-full relative z-10 overflow-hidden">
        
        {/* LEFT SIDE: VISUALS */}
        <div className={`hidden lg:flex w-1/2 flex-col justify-center px-12 xl:px-20 border-r backdrop-blur-[1px] transition-colors duration-500 ${isDark ? "border-white/5 bg-white/[0.005]" : "border-slate-200 bg-white/40"}`}>
          
          <div className="flex flex-col space-y-8">
              
              {/* BRANDING */}
              <div>
                  <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 p-2">
                          <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            <path d="M12 8l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" className="fill-white animate-pulse" stroke="none" />
                          </svg>
                      </div>
                      
                      <h1 className="text-2xl font-extrabold tracking-tight uppercase font-tech text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                        StudyFlow AI
                      </h1>
                  </div>
                  
                  <h2 className="text-4xl xl:text-5xl font-bold leading-tight font-tech">
                      Knowledge, <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Accelerated.</span>
                  </h2>
              </div>

              {/* VISUAL PIPELINE */}
              <div className="flex items-center gap-4 xl:gap-6 opacity-90">
                  <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 border rounded-xl flex items-center justify-center shadow-lg transition-colors ${isDark ? "bg-[#0a0a0f] border-white/10" : "bg-white border-slate-200"}`}>
                          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider font-tech opacity-70">PDF Upload</span>
                  </div>
                  <div className={`h-[2px] w-8 rounded-full ${isDark ? "bg-white/10" : "bg-slate-300"}`}></div>
                  <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 border rounded-xl flex items-center justify-center shadow-md relative ${isDark ? "bg-[#0a0a0f] border-emerald-500/30" : "bg-white border-emerald-200"}`}>
                          <div className="absolute inset-0 bg-emerald-500/10 rounded-xl animate-pulse"></div>
                          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider font-tech">AI Engine</span>
                  </div>
                  <div className={`h-[2px] w-8 rounded-full ${isDark ? "bg-white/10" : "bg-slate-300"}`}></div>
                  <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 border rounded-xl flex items-center justify-center shadow-lg transition-colors ${isDark ? "bg-[#0a0a0f] border-white/10" : "bg-white border-slate-200"}`}>
                          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider font-tech opacity-70">Flashcards</span>
                  </div>
              </div>

              {/* TERMINAL */}
              <div className={`w-full max-w-[420px] border rounded-xl font-code text-xs shadow-2xl relative overflow-hidden flex flex-col h-52 shrink-0 transition-colors duration-500 ${isDark ? "bg-black/80 border-white/10 shadow-black/50" : "bg-white border-slate-200 shadow-slate-200"}`}>
                   <div className={`flex items-center justify-between px-3 h-9 border-b shrink-0 ${isDark ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"}`}>
                       <span className="font-bold uppercase tracking-widest text-[10px] opacity-50">System Kernel</span>
                       <div className="flex gap-2">
                           <div className="w-2 h-2 rounded-full bg-red-500"></div>
                           <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                           <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                       </div>
                   </div>
                   <div className="flex-1 p-4 flex flex-col justify-end overflow-hidden">
                       {terminalLines.map((line, idx) => (
                          <div key={idx} className={`${line.color} mb-1.5 whitespace-nowrap`}>
                              {line.text}
                          </div>
                       ))}
                   </div>
                   <div className={`px-3 h-9 border-t flex justify-between items-center text-[9px] uppercase tracking-widest shrink-0 ${isDark ? "border-white/10 bg-[#0a0a0f] text-slate-500" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                       <div className="flex items-center gap-2 text-emerald-500 font-bold">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Active Monitoring
                       </div>
                       <div>SECURE CONN.</div>
                   </div>
              </div>
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
          
          {/* WIDENED CONTAINER to 580px */}
          <div className="w-full max-w-[580px]">
               <div className={`border rounded-2xl p-10 shadow-2xl backdrop-blur-xl transition-colors duration-500 ${isDark ? "bg-[#050508]/90 border-white/10" : "bg-white/80 border-white/40 shadow-slate-200/50"}`}>
                  
                  <div className="text-center mb-8">
                      <h3 className="text-xl font-bold font-tech transition-colors duration-300">Welcome Back</h3>
                      <p className={`text-xs mt-1 font-tech ${isDark ? "text-slate-400" : "text-slate-500"}`}>Log in to access your workspace</p>
                  </div>

                  <SignIn 
                      appearance={{
                          baseTheme: isDark ? dark : undefined,
                          variables: {
                              colorPrimary: "#10b981", 
                              colorBackground: "transparent", 
                              colorInputBackground: isDark ? "#0a0a0d" : "#f1f5f9",
                              colorInputText: isDark ? "white" : "#0f172a",
                              colorText: isDark ? "white" : "#0f172a",
                              colorTextSecondary: isDark ? "#94a3b8" : "#64748b",
                              borderRadius: "0.5rem",
                              spacingUnit: "1rem",
                              fontFamily: "'Space Grotesk', sans-serif"
                          },
                          elements: {
                              card: "shadow-none bg-transparent p-0 w-full border-none",
                              rootBox: "w-full",
                              headerTitle: "hidden",
                              headerSubtitle: "hidden",
                              socialButtonsBlockButton: `border transition-colors ${isDark ? "bg-[#0a0a0d] border-white/10 hover:bg-[#131316]" : "bg-white border-slate-200 hover:bg-slate-50"} text-xs font-medium h-11 w-full`,
                              dividerLine: isDark ? "bg-white/10" : "bg-slate-200",
                              dividerText: "text-slate-500 text-[10px] font-bold uppercase",
                              formFieldLabel: "text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2",
                              formFieldInput: `border focus:border-emerald-500/50 text-sm h-11 px-4 w-full font-sans transition-colors ${isDark ? "bg-[#0a0a0d] border-white/10" : "bg-white border-slate-200"}`,
                              formButtonPrimary: "bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest h-11 mt-4 w-full",
                              
                              footerActionLink: "text-emerald-500 hover:text-emerald-400 font-bold ml-1",
                              footerActionText: "text-slate-400 font-tech text-[11px]",
                              footer: "mt-6"
                          }
                      }}
                  />

               </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className={`shrink-0 w-full py-3 border-t backdrop-blur-md z-20 text-center transition-colors duration-500 ${isDark ? "border-white/5 bg-[#020203]/80" : "border-slate-200 bg-white/80"}`}>
        <p className="text-[10px] text-slate-500 font-code tracking-wider">
           &copy; 2026 STUDYFLOW AI. ALL RIGHTS RESERVED. <span className="opacity-50 mx-2">|</span> MADE BY AAYUSH OJHA
        </p>
      </footer>

    </div>
  );
}

export default Login;