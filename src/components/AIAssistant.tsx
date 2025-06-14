
import { Bot, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AIAssistant({ prompt = "Ask me anything about your dashboard!" }: { prompt?: string }) {
  const [messages, setMessages] = useState([
    { from: "ai", content: "Hello! I'm your AI Companion. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Placeholder: Echo user message. Hook to real AI later.
  const handleSend = () => {
    if (!input.trim()) return;
    setIsSending(true);
    setMessages(msgs => [
      ...msgs,
      { from: "user", content: input },
      { from: "ai", content: `You said: ${input}` }
    ]);
    setInput("");
    setTimeout(() => setIsSending(false), 300); // fake delay
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-muted shadow-lg border p-4 flex flex-col gap-3 h-[400px] relative">
      <div className="flex items-center gap-2 font-semibold mb-2">
        <Bot className="text-primary" /> AI Companion
      </div>
      <div className="flex-1 overflow-y-auto bg-background rounded-md px-1 py-2 mb-1 text-sm space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <span className={`inline-block px-3 py-2 rounded-2xl max-w-[85%] 
              ${msg.from === "user" ? "bg-primary text-white" : "bg-accent text-accent-foreground"}`}>
              {msg.content}
            </span>
          </div>
        ))}
        {isSending && <div className="text-xs text-muted-foreground italic">Thinking...</div>}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={prompt}
          className="bg-background"
          onKeyDown={e => e.key === "Enter" && handleSend()}
          disabled={isSending}
        />
        <Button size="icon" onClick={handleSend} disabled={isSending || !input.trim()}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}
