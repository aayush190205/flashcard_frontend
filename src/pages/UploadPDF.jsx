import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { 
  FileUp, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ChevronLeft
} from "lucide-react";

const UploadPDF = () => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();
  
  // --- CONFIGURATION ---
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [existingDocCount, setExistingDocCount] = useState(0);

  useEffect(() => {
    const fetchDocCount = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE}/api/pdf?clerkId=${user.id}`);
        const result = await res.json();
        if (result.success) {
          setExistingDocCount(result.data.length);
        }
      } catch (err) {
        console.error("Error fetching count:", err);
      }
    };
    fetchDocCount();
  }, [user, API_BASE]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError("");

    const nonPdfs = selectedFiles.filter(file => file.type !== "application/pdf");
    if (nonPdfs.length > 0) {
      setError("Only PDF files are allowed.");
      return;
    }

    if (existingDocCount + selectedFiles.length > 5) {
      setError(`Limit exceeded. You can only upload ${5 - existingDocCount} more document(s).`);
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      // Loop through each file in the queue
      for (const file of files) {
        // 1. Initialize FormData
        const formData = new FormData();
        
        // 2. Append the file with the key 'file' to match backend
        formData.append("file", file);
        
        // 3. Append metadata needed by the controller
        formData.append("clerkId", user.id);
        formData.append("title", file.name.replace(".pdf", ""));

        // 4. Send request without manual 'Content-Type' header
        const res = await fetch(`${API_BASE}/api/pdf/upload`, {
          method: "POST",
          body: formData, // Browser sets multipart/form-data automatically
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 font-sans">
      <button 
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
      </button>

      <div className={`rounded-[2.5rem] border ${isDark ? 'bg-[#0a0a0f] border-white/10' : 'bg-white border-slate-200 shadow-2xl'} p-10`}>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <FileUp size={32} />
          </div>
          <div>
            <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Upload Documents</h1>
            <p className="text-sm text-slate-500 font-medium">Library Capacity: {existingDocCount}/5 documents used</p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="relative group">
            <input 
              type="file" 
              multiple 
              accept=".pdf" 
              onChange={handleFileChange}
              disabled={existingDocCount >= 5 || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            />
            <div className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all ${
              isDark ? 'border-white/10 bg-white/[0.02] group-hover:border-emerald-500/50' : 'border-slate-200 bg-slate-50 group-hover:border-emerald-500'
            } ${existingDocCount >= 5 ? 'opacity-50 grayscale' : ''}`}>
              <FileText size={48} className="mx-auto mb-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {existingDocCount >= 5 ? "Storage Full" : "Click or Drag PDFs here"}
              </p>
              <p className="text-xs text-slate-500 mt-2 font-medium">Maximum 10MB per file • PDF Only</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Queue ({files.length})</p>
              {files.map((file, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-emerald-500" />
                    <span className={`text-sm font-bold truncate max-w-[250px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{file.name}</span>
                  </div>
                  <button type="button" onClick={() => removeFile(index)} className="text-slate-500 hover:text-red-500 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={files.length === 0 || isUploading}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 ${
              files.length === 0 || isUploading 
              ? 'bg-slate-500/20 text-slate-500 cursor-not-allowed' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 active:scale-[0.98]'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Processing Documents...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} /> Start Processing ({files.length})
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
          Secure Encrypted Upload • StudyFlow Core
        </p>
      </div>
    </div>
  );
};

export default UploadPDF;