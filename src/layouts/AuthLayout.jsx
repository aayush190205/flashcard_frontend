import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    // Apply Terminal Theme ONLY here
    <div className="theme-terminal min-h-screen flex relative overflow-hidden selection:bg-green-500/30 selection:text-green-100">
      
      {/* CRT Overlay Effects */}
      <div className="crt-overlay" />
      <div className="fixed top-0 left-0 w-full h-2 bg-green-500/20 z-40 animate-[scanline_6s_linear_infinite] pointer-events-none" />

      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', 
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Left Side - Visuals (AI Core) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center border-r border-green-900/30 bg-black/40 backdrop-blur-sm">
        <div className="relative z-10 flex flex-col items-center">
           {/* Animated Wireframe Circle */}
           <div className="w-64 h-64 border border-green-500/20 rounded-full flex items-center justify-center relative mb-12">
             <div className="absolute inset-0 border-t-2 border-green-500/60 rounded-full animate-[spin_10s_linear_infinite]"></div>
             <div className="absolute inset-4 border-b-2 border-green-500/40 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
             
             {/* Center Icon */}
             <div className="text-green-500 font-bold text-3xl tracking-tighter animate-pulse shadow-green-500/50 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
               AI_CORE
             </div>
           </div>
           
           <h1 className="text-5xl font-bold tracking-wider text-green-500 mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
             StudyFlow
           </h1>
           <p className="text-green-700 font-mono text-sm tracking-widest uppercase">
             Secure Learning Environment
           </p>
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;