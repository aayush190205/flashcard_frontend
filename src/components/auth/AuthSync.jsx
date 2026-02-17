import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

const AuthSync = () => {
  const { user, isLoaded } = useUser();
  
  // --- CONFIGURATION ---
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && user) {
        try {
          // MUST match backend prefix: /api/auth/sync
          const res = await fetch(`${API_BASE}/api/auth/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress.emailAddress,
              username: user.fullName || user.firstName,
            }),
          });
          
          const data = await res.json();
          console.log("Sync Status:", data.success ? "✅ Success" : "❌ Failed");
        } catch (error) {
          console.error("Sync Error:", error);
        }
      }
    };
    syncUser();
  }, [isLoaded, user, API_BASE]);

  return null;
};

export default AuthSync;