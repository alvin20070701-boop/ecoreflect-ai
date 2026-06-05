import React from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, Send, Sparkles, HelpCircle, User, Brain, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SUGGESTED_QUESTIONS = [
  'Why is Fast Fashion harmful?',
  'How can I reduce impulse buying?',
  'How can I build a sustainable wardrobe?',
  'What are examples of responsible consumption?'
];

export default function Coach() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello there! I am your Sustainable Consumption Coach. I'm here to support you in achieving UN Sustainable Development Goal 12.8. Let's work together to make your consumer habits more responsible, design a circular wardrobe, and understand the ecological foot-print of fast fashion. Ask me anything, or try clicking one of the suggestions below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new message insertions
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setError('');
    const userMessage: ChatMessage = {
      id: `m-usr-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            text: msg.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Connection to Sustainable Coaching mainframe aborted.');
      }

      const data = await response.json();
      
      const coachMessage: ChatMessage = {
        id: `m-mdl-${Date.now()}`,
        role: 'model',
        text: data.text || "I was unable to structure an assessment. Please try rephrasing your sustainable query.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, coachMessage]);
    } catch (err: any) {
      console.error(err);
      setError('Coaching connection failed. Let me assist you locally or check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] min-h-[500px] border border-emerald-100 rounded-2xl bg-slate-50/20 overflow-hidden shadow-xs" id="chat-center-container">
      
      {/* Coach Header info */}
      <div className="px-5 py-4 border-b border-emerald-50 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-slate-800 leading-none">Sustainable Consumption Coach</h2>
            <p className="text-slate-400 text-[11px] font-medium mt-1 uppercase tracking-wider font-mono">SDG 12.8 COUNSEL MODULE</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wider font-mono uppercase">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Gemini Online
        </span>
      </div>

      {/* CHAT MESSAGES BODY SCROLLER */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 min-h-0" id="chat-messages-scroller">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] text-left ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              id={`bubble-${msg.id}`}
            >
              {/* Profile/role indicator */}
              <div className={`flex h-8.5 w-8.5 shrink-0 select-none items-center justify-center rounded-lg ${
                isUser ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-700'
              }`}>
                {isUser ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
              </div>

              {/* Message block */}
              <div className="space-y-1">
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-3xs ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100/60'
                }`}>
                  {/* Handle linebreaks in rendering */}
                  <p className="whitespace-pre-line font-sans">
                    {msg.text}
                  </p>
                </div>
                {/* Timestamp */}
                <div className={`text-[10px] text-slate-400 font-medium px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing spinner for generation delay */}
        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto text-left" id="chat-coaching-typing">
            <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-emerald-700 animate-pulse">
              <Brain className="h-4 w-4" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3.5 border border-slate-100/50 flex items-center gap-1.5 shadow-3xs">
              <div className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce"></div>
              <div className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce delay-100"></div>
              <div className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 flex gap-2 text-red-800 text-xs text-left" id="chat-error-bar">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* End Reference */}
        <div ref={chatEndRef} />
      </div>

      {/* QUICK SUGGESTIONS TRIGGER ROWS */}
      <div className="px-5 py-2 bg-slate-50 border-t border-emerald-50/40" id="chat-prompt-suggestions">
        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="h-3.5 w-3.5" /> Direct suggestions:
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              id={`quick-question-${idx}`}
              disabled={loading}
              onClick={() => handleSendMessage(q)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-xs font-semibold shrink-0 transition-colors cursor-pointer shadow-3xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT CHAT INPUT BOX FORM */}
      <div className="p-4 bg-white border-t border-emerald-50 flex items-center">
        <form onSubmit={handleFormSubmit} className="flex gap-2 w-full" id="chat-input-form">
          <input
            id="chat-user-input"
            required
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask your Sustainable Coach anything... (e.g. 'How is water waste generated by denim jeans?')"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none placeholder-slate-400"
          />
          <button
            id="btn-chat-submit"
            disabled={!input.trim() || loading}
            type="submit"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center shadow-xs shrink-0"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
