import { useEffect, useRef } from "react";

function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex flex-col max-w-[80%] ${
            msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
          }`}
        >
          <span className="text-[10px] text-green-800 uppercase mb-1 tracking-widest">
            {msg.role === "user" ? "USER_COMMAND" : "SYSTEM_RESPONSE"}
          </span>
          <div
            className={`p-4 border text-sm ${
              msg.role === "user"
                ? "border-green-600 bg-green-900/20 text-green-300"
                : "border-green-900 bg-black text-green-500"
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;