import { useState } from "react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 border-t border-green-900 bg-black">
      <div className="flex items-center gap-2">
        <span className="text-green-500 font-bold">{`>`}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command query..."
          className="flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none font-mono placeholder-green-900"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          autoFocus
        />
        <button
          onClick={handleSend}
          className="text-xs bg-green-900/30 border border-green-700 text-green-400 px-4 py-2 hover:bg-green-500 hover:text-black transition-colors uppercase tracking-wider"
        >
          EXEC
        </button>
      </div>
    </div>
  );
}

export default ChatInput;