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
  
  // HARDCODED FOR DEMO RELIABILITY
  const baseUrl = "https://ai-flashcard-backend-j20a.onrender.com";

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleSOS = async () => {
    if (!selectedDocId || isLoading) return;
    const userMsg = { role: "user", content: "I'm stuck. Can you give me a hint without giving away the answer?" };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            message: "[STUDENT_STUCK] The student is stuck. Give a Socratic hint. DO NOT give the direct answer.", 
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
      <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${isDark ? 'bg-[#0B0C15] border-gray-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-800 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <Bot size={20} />
            </div>
            <div>
                <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Tutor</h2>
            </div>
        </div>
        <div className="relative">
            <select value={selectedDocId} onChange={(e) => setSelectedDocId(e.target.value)} className={`pl-9 pr-10 py-2.5 rounded-lg text-xs font-semibold outline-none border cursor-pointer ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              {documents.map(d => <option key={d._id} value={d._id}>{d.title}</option>)}
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`p-5 rounded-2xl shadow-sm text-sm ${msg.role === "user" ? "bg-slate-900 text-white" : isDark ? "bg-gray-800 text-gray-100" : "bg-white border text-slate-700"}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
            </div>
          </div>
        ))}
        {isLoading && <div className="animate-pulse p-4">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className={`p-4 md:p-6 border-t shrink-0 ${isDark ? 'bg-[#0B0C15] border-gray-800' : 'bg-white border-slate-200'}`}>
            <form onSubmit={handleSend} className={`flex items-center gap-2 p-1.5 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                <button onClick={handleSOS} type="button" className={`p-2.5 rounded-lg flex items-center gap-2 ${isDark ? 'text-amber-500 hover:bg-amber-500/10' : 'text-amber-600 hover:bg-amber-50'}`}>
                    <LifeBuoy size={18} /> <span className="hidden sm:inline">Hint</span>
                </button>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." className={`flex-1 bg-transparent px-2 py-2 outline-none text-sm ${isDark ? 'text-white' : 'text-slate-900'}`} />
                <button type="submit" disabled={!input.trim() || isLoading} className="p-2.5 rounded-lg bg-emerald-600 text-white"><Send size={18} /></button>
            </form>
      </div>
    </div>
  );
};

export default Chatbot;