import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";
import ReactMarkdown from 'react-markdown';
import { 
  Send, Bot, Loader2, Paperclip, 
  ChevronDown, User, FileText, LifeBuoy 
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
  const baseUrl = "https://ai-flashcard-backend-j20a.onrender.com";
  

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
      });
  }, [user]);

  // 2. Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message (Standard)
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
        body: JSON.stringify({ message: userMsg.content, documentId: selectedDocId, history: messages }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection Error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Trigger Socratic Hint (Hidden State Machine Trigger)
  const handleSOS = async () => {
    if (!selectedDocId || isLoading) return;
    
    // Display a friendly message to the user locally
    const userMsg = { role: "user", content: "I'm stuck. Can you give me a hint without giving away the answer?" };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the hidden system trigger to the backend
        body: JSON.stringify({ 
            message: "[STUDENT_STUCK] The student is stuck. Enter Remediation State. Give a Socratic hint or ask a simpler foundational question. DO NOT give the direct answer.", 
            documentId: selectedDocId, 
            history: messages 
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection Error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-3rem)] w-full overflow-hidden ${isDark ? 'bg-[#0B0C15]' : 'bg-white'}`}>

      {/* HEADER */}
      <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${isDark ? 'bg-[#0B0C15] border-gray-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-800 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <Bot size={20} />
            </div>
            <div>
                <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Tutor</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wide">Online</span>
                </div>
            </div>
        </div>

        {/* Document Selector */}
        <div className="relative">
            <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select 
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className={`pl-9 pr-10 py-2.5 rounded-lg text-xs font-semibold outline-none border cursor-pointer transition-all hover:border-emerald-500 focus:border-emerald-500 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
            >
              {documents.length === 0 && <option>No PDF Uploaded</option>}
              {documents.map(d => <option key={d._id} value={d._id}>{d.title}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
            
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold shadow-sm mt-1 ${
                    msg.role === "user" 
                    ? "bg-slate-200 text-slate-600" 
                    : "bg-emerald-600 text-white"
                }`}>
                    {msg.role === "user" ? "ME" : <Bot size={14}/>}
                </div>

                {/* Message Bubble */}
                <div className={`p-5 rounded-2xl shadow-sm leading-relaxed text-sm ${
                    msg.role === "user" 
                    ? "bg-slate-900 text-white rounded-tr-sm" 
                    : isDark ? "bg-gray-800 border border-gray-700 text-gray-100 rounded-tl-sm" : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                }`}>
                    <div className="prose prose-sm max-w-none dark:prose-invert break-words">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                </div>
            </div>

          </div>
        ))}

        {isLoading && (
            <div className="flex w-full justify-start animate-pulse">
                <div className="flex max-w-[75%] gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-1">
                        <Loader2 size={14} className="animate-spin" />
                    </div>
                    <div className={`p-4 rounded-2xl text-xs font-bold ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-slate-500'}`}>
                        Thinking...
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className={`p-4 md:p-6 border-t shrink-0 ${isDark ? 'bg-[#0B0C15] border-gray-800' : 'bg-white border-slate-200'}`}>
        <div className="w-full"> 
            <form onSubmit={handleSend} className={`flex items-center gap-2 p-1.5 rounded-xl border focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                
                <button type="button" className={`p-2.5 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                    <Paperclip size={18} />
                </button>

                {/* THE NEW SOCRATIC HINT BUTTON */}
                <button 
                    type="button" 
                    onClick={handleSOS}
                    disabled={documents.length === 0 || isLoading}
                    title="Get a Socratic Hint"
                    className={`p-2.5 rounded-lg transition-all font-bold text-xs flex items-center gap-2 ${isDark ? 'text-amber-500 hover:bg-amber-500/10' : 'text-amber-600 hover:bg-amber-50 shadow-sm'}`}
                >
                    <LifeBuoy size={18} />
                    <span className="hidden sm:inline">Hint</span>
                </button>

                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={documents.length > 0 ? "Ask a question..." : "Upload a PDF first"}
                    disabled={documents.length === 0 || isLoading}
                    className={`flex-1 bg-transparent px-2 py-2 outline-none text-sm font-medium ${isDark ? 'text-white placeholder:text-gray-500' : 'text-slate-900 placeholder:text-slate-400'}`}
                />
                
                <button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                        !input.trim() || isLoading 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                    }`}
                >
                    <Send size={18} />
                </button>
            </form>
            <div className="text-center mt-2">
                <p className={`text-[10px] font-medium ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>
                    StudyFlow AI can make mistakes. Check important info.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;