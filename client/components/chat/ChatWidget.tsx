import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { ChatMessage, ChatResponse } from "@shared/api";

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m your Lifeline assistant. Ask me about donor eligibility, SOS alerts, rewards, and matching.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMessage = { role: "user", content: text };
    setMessages((m) => [...m, next]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, next] }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as ChatResponse;
      setMessages((m) => [...m, data.message]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I couldn't reach the server. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="btn-brand shadow-lg" size="lg">
            Chat
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-[min(420px,100vw)] flex-col p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Lifeline Assistant</SheetTitle>
          </SheetHeader>
          <div className="flex-1 p-3">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <ChatBubble key={i} message={m} />
                ))}
                {loading && (
                  <div className="text-xs text-muted-foreground">Assistant is typing…</div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </div>
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={loading}
              />
              <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                Send
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
