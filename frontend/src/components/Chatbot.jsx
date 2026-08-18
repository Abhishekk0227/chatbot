import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, Loader2, Phone, ArrowRight, MessageCircle, FileText, Check, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3001"
  : "https://soaring-aerotech-two.vercel.app";

// Helper to format messages (bold text and hyperlinks)
const formatMessageText = (text) => {
  if (!text) return "";

  // Split text by newlines to handle paragraph breaks
  const paragraphs = text.split("\n");

  return paragraphs.map((para, pIdx) => {
    // 1. Parse markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(para)) !== null) {
      // Add text before link
      if (match.index > lastIndex) {
        parts.push(para.substring(lastIndex, match.index));
      }
      
      const linkText = match[1];
      const linkUrl = match[2];
      
      parts.push(
        <a 
          key={match.index} 
          href={linkUrl} 
          target={linkUrl.startsWith("http") ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
        >
          {linkText}
          {linkUrl.startsWith("http") && <ArrowRight className="w-3 h-3 inline" />}
        </a>
      );
      
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < para.length) {
      parts.push(para.substring(lastIndex));
    }

    // If there were no links, just use the paragraph text
    const content = parts.length > 0 ? parts : [para];

    // 2. Parse markdown bold **text** within each part
    const formattedContent = content.map((part, partIdx) => {
      if (typeof part !== "string") return part;

      const boldRegex = /\*\*([^*]+)\*\*/g;
      let boldParts = [];
      let boldLastIndex = 0;
      let boldMatch;

      while ((boldMatch = boldRegex.exec(part)) !== null) {
        if (boldMatch.index > boldLastIndex) {
          boldParts.push(part.substring(boldLastIndex, boldMatch.index));
        }
        boldParts.push(<strong key={boldMatch.index} className="font-extrabold text-foreground">{boldMatch[1]}</strong>);
        boldLastIndex = boldRegex.lastIndex;
      }

      if (boldLastIndex < part.length) {
        boldParts.push(part.substring(boldLastIndex));
      }

      return boldParts.length > 0 ? boldParts : part;
    });

    return (
      <p key={pIdx} className="mb-2 last:mb-0 leading-relaxed text-xs sm:text-sm">
        {formattedContent}
      </p>
    );
  });
};

const SUGGESTIONS = [
  { text: "Drone Courses & Fees 🎓", query: "What are the drone training course details and fees?" },
  { text: "Call Us Directly 📞", query: "Call now" },
  { text: "Drone Services 🚀", query: "What types of industrial drone services do you provide?" },
  { text: "Eligibility Criteria 📝", query: "What are the eligibility criteria and documents required for DGCA pilot training?" }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! 🙏 I am the Soaring Assistant, the AI representative of Soaring Aerotech. How can I help you today? You can ask me about our drone courses, industrial services, fees, or contact details!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // wouter location hook for AI Copilot routing
  const [location, setLocation] = useLocation();

  // Lead states
  const [leadInfo, setLeadInfo] = useState({
    name: null,
    phone: null,
    email: null,
    course: null,
    city: null,
    background: null
  });
  const [leadScore, setLeadScore] = useState(0);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Lead qualification auto-submitter
  useEffect(() => {
    const submitQualifiedLead = async () => {
      // Qualify when we have name and phone
      if (leadInfo.name && leadInfo.phone && !leadSubmitted) {
        setLeadSubmitted(true);
        // Automatically bump lead score to 100 on submission
        setLeadScore(100);
        try {
          console.log("📤 Submitting qualified lead from Chatbot...", leadInfo);
          const response = await fetch(`${API_BASE}/api/forms/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "chatbot_lead",
              name: leadInfo.name,
              phone: leadInfo.phone,
              email: leadInfo.email || "N/A",
              subject: "AI Chatbot Qualified Lead",
              program: leadInfo.course || "General Inquiry",
              message: `Qualified Lead from AI Chatbot. Profile Details:\n` +
                       `- Background: ${leadInfo.background || "Not specified"}\n` +
                       `- City: ${leadInfo.city || "Not specified"}`
            })
          });
          const resData = await response.json();
          if (resData.success) {
            console.log("✅ Chatbot lead qualified and saved!");
          }
        } catch (error) {
          console.error("❌ Failed to save chatbot lead:", error);
        }
      }
    };
    submitQualifiedLead();
  }, [leadInfo, leadSubmitted]);

  // AI Copilot Action Engine
  const executeCopilotAction = (action) => {
    if (!action || action === "none") return;

    console.log(`🤖 AI Copilot Action Triggered: ${action}`);
    const parts = action.split(":");
    const type = parts[0];
    const target = parts[1];

    let targetPath = "";
    let elementId = "";

    if (target === "training") targetPath = "/training";
    else if (target === "services") targetPath = "/services";
    else if (target === "about") targetPath = "/about";
    else if (target === "contact") targetPath = "/contact";
    else if (target === "gallery") targetPath = "/media";
    else if (target === "apply") {
      targetPath = "/training";
      elementId = "enroll";
    }

    if (targetPath) {
      if (location !== targetPath) {
        // Route to target page
        setLocation(targetPath);
        // Wait for render, then scroll
        setTimeout(() => {
          if (elementId) {
            const el = document.getElementById(elementId);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              el.classList.add("ring-4", "ring-primary", "ring-offset-2", "transition-all", "duration-500");
              setTimeout(() => {
                el.classList.remove("ring-4", "ring-primary", "ring-offset-2");
              }, 3000);
            }
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 600);
      } else {
        // Already on the target page, scroll immediately
        if (elementId || target === "apply") {
          const el = document.getElementById("enroll");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            el.classList.add("ring-4", "ring-primary", "ring-offset-2", "transition-all", "duration-500");
            setTimeout(() => {
              el.classList.remove("ring-4", "ring-primary", "ring-offset-2");
            }, 3000);
          }
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!textToSend) setInput("");
    
    const userMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Check direct call dialing
    const lowerText = text.toLowerCase();
    const isCallCommand = lowerText.includes("call lagao") || 
                          lowerText.includes("call karo") || 
                          lowerText.includes("direct call") || 
                          lowerText.includes("call now") ||
                          lowerText.includes("call dialing") ||
                          (lowerText.includes("call") && (lowerText.includes("me") || lowerText.includes("us") || lowerText.includes("now") || lowerText.includes("direct")));
    
    if (isCallCommand) {
      setIsLoading(true);
      
      // Automatically dial
      setTimeout(() => {
        window.location.href = "tel:+917869918736";
      }, 500);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          role: "assistant",
          text: "Sure! Initiating a direct phone call to Soaring Aerotech (+91 78699 18736) in your browser/device dialer. If it didn't open automatically, please click the call buttons below.",
          timestamp: new Date()
        }]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    setIsLoading(true);

    try {
      // Format history (only send clean roles and text messages)
      const history = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history })
      });

      const data = await res.json();

      if (data.success) {
        // Update lead state if info was extracted
        if (data.extractedInfo) {
          setLeadInfo(prev => {
            const updated = { ...prev };
            Object.keys(data.extractedInfo).forEach(key => {
              if (data.extractedInfo[key] !== null && data.extractedInfo[key] !== undefined) {
                updated[key] = data.extractedInfo[key];
              }
            });
            return updated;
          });
        }

        // Increment lead score
        if (data.leadScoreIncrement) {
          setLeadScore(prev => Math.min(prev + data.leadScoreIncrement, 100));
        }

        // Set dynamic suggestions
        if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
          setSuggestions(data.suggestedQuestions.map(q => ({
            text: q,
            query: q
          })));
        }

        // Add assistant reply message
        setMessages(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          role: "assistant",
          text: data.reply,
          timestamp: new Date()
        }]);

        // Execute copilot page scrolling & routing
        if (data.action && data.action !== "none") {
          executeCopilotAction(data.action);
        }
      } else {
        throw new Error(data.error || "Failed response");
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        text: "I apologize, but I am facing a connection issue right now. Please try again or feel free to call our support line at **+91 78699 18736**.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ── Chat Window ────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[90vw] sm:w-[400px] h-[520px] sm:h-[600px] rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col mb-4 bg-opacity-95 backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-[#111111] p-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary relative">
                  <Bot className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#111111] rounded-full animate-pulse" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">Soaring Assistant</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest">AI Agent</span>
                    <Sparkles className="w-2.5 h-2.5 text-primary" />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Matching Progress Bar */}
            {leadScore > 0 && (
              <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-white/5 shrink-0 text-[10px]">
                <div className="flex items-center gap-1.5 text-white/60">
                  <Award className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Profile Match Progress:</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-500" 
                      style={{ width: `${leadScore}%` }} 
                    />
                  </div>
                  {leadSubmitted ? (
                    <span className="text-green-400 font-bold flex items-center gap-0.5 font-mono"><Check className="w-3 h-3" /> Qualified</span>
                  ) : (
                    <span className="font-bold font-mono text-white">{leadScore}%</span>
                  )}
                </div>
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50/50">
              {messages.map((msg) => {
                const isCallRelated = msg.role === "assistant" && (
                  msg.text.includes("+91") || 
                  msg.text.toLowerCase().includes("call") || 
                  msg.text.toLowerCase().includes("contact number")
                );

                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-2.5 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-[#111111] border border-border flex items-center justify-center shrink-0 text-primary mt-1">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`p-3.5 rounded-2xl ${
                          msg.role === "user"
                            ? "bg-primary text-white rounded-tr-none shadow-md"
                            : "bg-white text-slate-800 rounded-tl-none border border-slate-200/50 shadow-sm"
                        }`}
                      >
                        {formatMessageText(msg.text)}

                        {isCallRelated && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                            <a 
                              href="tel:+917869918736"
                              className="w-full flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/95 font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-colors"
                            >
                              <Phone className="w-3 h-3" /> Call +91 78699 18736
                            </a>
                            <a 
                              href="https://wa.me/917869918736"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#20ba59] font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" /> WhatsApp Us
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Loader */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2.5 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-[#111111] border border-border flex items-center justify-center shrink-0 text-primary mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-3 bg-white rounded-2xl rounded-tl-none border border-slate-200/50 flex items-center gap-2 text-slate-500 shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-xs font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Action Engine Buttons & Dynamic Suggestions */}
            {!isLoading && (
              <div className="border-t border-slate-150 p-2 bg-white flex flex-col gap-2 shrink-0">
                {/* suggested questions */}
                {suggestions && suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-1 py-1 max-h-[85px] overflow-y-auto">
                    {suggestions.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip.query || chip.text)}
                        className="text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1 hover:border-primary hover:text-primary transition-all active:scale-95 cursor-pointer shadow-sm"
                      >
                        {chip.text}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick actions strip */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-2 px-1 text-[11px]">
                  <a 
                    href="tel:+917869918736" 
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-primary" /> Call
                  </a>
                  <a 
                    href="https://wa.me/917869918736" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3 text-green-500" /> WhatsApp
                  </a>
                  <button 
                    onClick={() => handleSend("Register / Apply for course")} 
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-primary text-white hover:bg-primary/95 font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Apply Now
                  </button>
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-slate-200 bg-white flex gap-2 items-center shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask your enquiry here..."
                disabled={isLoading}
                className="flex-1 bg-[#F5F5F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-primary text-slate-800 disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 p-0 rounded-xl flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Action Button ──────────────── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 w-14 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-2xl relative cursor-pointer border border-primary/20"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#111111]/30 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400 border-2 border-primary"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
