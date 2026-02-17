import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../services/auth.service"; // Import the real service

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email passed from Login page

  const isComplete = otp.length === 6;
  const [displayOtp, setDisplayOtp] = useState("");
  
  // Redirect if no email is found (user tried to skip login page)
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // Matrix glitch effect
  useEffect(() => {
    const chars = "X01"; 
    if (otp.length === 0) { setDisplayOtp(""); return; }
    let scrambled = otp.split('').map((char, i) => 
      i === otp.length - 1 ? chars[Math.floor(Math.random() * chars.length)] : char
    ).join('');
    setDisplayOtp(scrambled);
    const t = setTimeout(() => setDisplayOtp(otp), 100);
    return () => clearTimeout(t);
  }, [otp]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isComplete) return;
    
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      // Call the REAL backend
      await verifyOtp(email, otp);
      
      // Success! Go to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Show error from backend (e.g., "Invalid OTP")
      setError("AUTHENTICATION FAILED: INVALID TOKEN");
      setLoading(false);
      setOtp(""); // Clear input to try again
    }
  };

  return (
    <div className="relative group w-full max-w-sm">
      <div className="absolute -inset-0.5 bg-green-500/20 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>

      <div className="relative bg-black border-2 border-green-800 p-8 shadow-[0_0_40px_-10px_rgba(34,197,94,0.15)]">
        
        {/* Top Status Bar */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black border border-green-600 px-6 py-1 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
           <div className="flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${error ? "bg-red-500 animate-none" : "bg-green-500 animate-pulse"}`}></div>
             <span className={`text-[9px] tracking-[0.2em] uppercase font-bold ${error ? "text-red-500" : "text-green-400"}`}>
               {error ? "ACCESS_DENIED" : "2FA_LOCKED"}
             </span>
           </div>
        </div>

        <div className="text-center mt-6 mb-8">
          <h2 className="text-xl font-bold tracking-[0.2em] text-green-500 mb-2 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">
            SECURITY_KEY
          </h2>
          <p className="text-[10px] text-green-700 uppercase">Input 6-digit session token</p>
          {/* Display Email being verified */}
          <p className="text-[9px] text-green-900 mt-2 font-mono">{email}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="relative group/input">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setError(""); // Clear error when typing
              }}
              className={`w-full bg-green-900/5 border-b-2 text-center text-3xl tracking-[0.5em] text-transparent caret-green-500 focus:outline-none py-4 transition-all cursor-text z-10 relative
                ${error ? "border-red-800 focus:border-red-500" : "border-green-800 focus:border-green-400 focus:bg-green-900/10"}
              `}
              autoFocus
            />
            
            {/* Visual Glitch Layer */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className={`text-3xl tracking-[0.5em] font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] font-mono ${error ? "text-red-500" : "text-green-400"}`}>
                  {displayOtp || "......"}
               </span>
            </div>
            
            {/* Scanning Line Animation */}
            <div className={`absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-focus-within/input:w-full shadow-[0_0_10px_#4ade80] ${error ? "bg-red-500" : "bg-green-400"}`}></div>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="text-center animate-pulse">
               <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase border border-red-900/50 bg-red-900/10 py-2">
                 {error}
               </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isComplete || loading}
            className={`
              w-full py-4 text-xs font-bold uppercase tracking-[0.3em] border transition-all duration-300 relative overflow-hidden group/btn
              ${isComplete 
                ? "bg-green-900/20 border-green-500 text-green-400 hover:bg-green-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                : "border-green-900/50 text-green-900 cursor-not-allowed"}
            `}
          >
            <span className="relative z-10">{loading ? "DECRYPTING..." : "AUTHENTICATE"}</span>
          </button>
        </form>
        
        {/* Footer */}
        <div className="mt-6 text-center border-t border-green-900/30 pt-4">
           <p className="text-[9px] text-green-800/70 uppercase tracking-widest">
             Attempts Remaining: ∞
           </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;