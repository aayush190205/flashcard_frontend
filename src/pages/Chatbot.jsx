import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";
import ReactMarkdown from 'react-markdown';
import { 
  Send, Bot, Loader2, Paperclip, 
  ChevronDown, User, FileText 
} from "lucide-react";

const Chatbot = () => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! Select a document to start analyzing." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");

  // --- API CONFIGURATION ---
  // Using the Render URL directly to ensure connection. 
  // You can also use import.meta.env.VITE_API_URL if configured in Vercel.
  const rawBaseUrl = "https://ai-flashcard-backend-j20a.onrender.com";
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  // 1. Fetch Docs
  useEffect(() => {
    if (!user) return;
    fetch(`${baseUrl}/api/pdf?clerkId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setDocuments(data.data);
          setSelectedDocId(data.data[0]._id);
        }
      })
      .catch(err => console.error("Error fetching docs:", err));
  }, [user, baseUrl]);

  // 2. Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedDocId) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            message: userMsg.content, 
            documentId: selectedDocId, 
            history: messages 
        }),
      });

      if (!res.ok) throw new Error("Server error");
      
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection Error. Please check if the backend is awake." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-3rem)] w-full overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0B0C15]' : 'bg-slate-50'}`}>

      {/* HEADER */}
      <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 backdrop-blur-md ${isDark ? 'bg-[#0B0C15]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                <Bot size={20} />
            </div>
            <div>
                <h2 className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Tutor</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Session</span>
                </div>
            </div>
        </div>

        {/* Document Selector */}
        <div className="relative min-w-[200px]">
            <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select 
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-xs font-bold outline-none border cursor-pointer appearance-none transition-all ${isDark ? 'bg-white/5 border-white/10 text-white hover:border-indigo-500/50' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 shadow-sm'}`}
            >
              {documents.length === 0 && <option>No PDF Selected</option>}
              {documents.map(d => <option key={d._id} value={d._id}>{d.title}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-1 border ${
                    msg.role === "user" 
                    ? "bg-slate-100 border-slate-200 text-slate-600" 
                    : "bg-indigo-600 border-indigo-500 text-white"
                }`}>
                    {msg.role === "user" ? <User size={16}/> : <Bot size={16}/>}
                </div>

                {/* Message Bubble */}
                <div className={`p-5 rounded-2xl shadow-sm text-sm ${
                    msg.role === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : isDark ? "bg-[#1A1B23] border border-white/5 text-gray-100 rounded-tl-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-slate-100"
                }`}>
                    <div className="prose prose-sm max-w-none dark:prose-invert break-words leading-relaxed font-medium">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                </div>
            </div>
          </div>
        ))}

        {isLoading && (
            <div className="flex w-full justify-start animate-pulse">
                <div className="flex max-w-[75%] gap-4">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-lg shadow-indigo-600/20">
                        <Loader2 size={16} className="animate-spin" />
                    </div>
                    <div className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'bg-white/5 text-gray-400' : 'bg-white text-slate-500 shadow-sm border border-slate-100'}`}>
                        Thinking...
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className={`p-6 border-t shrink-0 ${isDark ? 'bg-[#0B0C15] border-white/5' : 'bg-white border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]'}`}>
        <div className="max-w-4xl mx-auto"> 
            <form onSubmit={handleSend} className={`flex items-center gap-3 p-2 rounded-2xl border transition-all duration-300 focus-within:ring-4 focus-within:ring-indigo-500/10 ${isDark ? 'bg-white/5 border-white/10 focus-within:border-indigo-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-400'}`}>
                
                <button type="button" className={`p-3 rounded-xl transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm'}`}>
                    <Paperclip size={20} />
                </button>

                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={documents.length > 0 ? "Ask the AI Tutor anything about your PDF..." : "Upload a PDF to start chatting"}
                    disabled={documents.length === 0 || isLoading}
                    className={`flex-1 bg-transparent px-2 py-3 outline-none text-sm font-semibold tracking-tight ${isDark ? 'text-white placeholder:text-gray-600' : 'text-slate-900 placeholder:text-slate-400'}`}
                />
                
                <button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        !input.trim() || isLoading 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-white/5 dark:text-gray-600' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                >
                    <Send size={20} fill="currentColor" />
                </button>
            </form>
            <p className={`text-center mt-3 text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-700' : 'text-slate-400'}`}>
                StudyFlow AI 2.0 • Powered by Llama 3.3
            </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;