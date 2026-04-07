import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChatbubbleEllipses, IoClose, IoSend } from 'react-icons/io5';
import { FiUser, FiZap } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

// System prompt — tells the AI everything about Uthan
const SYSTEM_PROMPT = `You are a helpful assistant for Uthan Senior Home Care, a licensed Social Adult Day Care center located at 1872 Deer Park Avenue, Deer Park, New York 11729 (Suffolk County, Long Island).

Key facts you must know:
- Phone: (516) 510-0267
- Email: uthancare@uthanseniorcare.com
- Hours: Monday–Friday, 10:00 AM – 3:00 PM
- Services: Recreational Activities, Family Counseling, Nutritious Meals, Transportation, Community Engagement, Yoga & Meditation
- Daily program includes: breakfast, lunch, healthy snacks, gentle exercise, yoga, meditation, engaging games, educational opportunities
- Eligibility: Adults 60+ in Suffolk County who benefit from companionship, stimulation, and structured activities
- Transportation: Door-to-door service available within service area
- The only Social Adult Day Care center of its kind in Suffolk County
- Certified by: NY Department of Health, Office for the Aging, Office of the Medicaid Inspector General
- Instagram: https://www.instagram.com/uthanseniorcare/
- Facebook: https://www.facebook.com/profile.php?id=61577295680997

Your role:
- Answer questions about services, eligibility, enrollment, hours, transportation, meals, activities
- Be warm, compassionate, and professional — you're talking to families researching senior care
- For appointments or enrollment, direct them to call (516) 510-0267 or fill out the contact form
- Keep responses concise and friendly — 2-3 sentences max unless more detail is needed
- If asked something you don't know, suggest calling or emailing directly`;

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function makeTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const WELCOME_MSG = {
  id: 'welcome',
  role: 'assistant',
  text: "Hi! 👋 Welcome to Uthan Senior Home Care. Let me know if you have any questions!",
  time: makeTime(),
};

const QUICK_REPLIES = [
  'What services do you offer?',
  'How do I enroll?',
  'What are your hours?',
  'Is transportation available?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('chat'); // 'chat' | 'form'
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);
  // Keep OpenAI conversation history (role/content format)
  const historyRef = useRef([]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, thinking]);

  function addMsg(text, role = 'user') {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), role, text, time: makeTime() }]);
  }

  async function askAI(userText) {
    if (!OPENAI_KEY || OPENAI_KEY === 'YOUR_OPENAI_API_KEY') {
      // Fallback if no key set
      addMsg("Thank you for your message! Our team will follow up shortly. You can also call us at (516) 510-0267.", 'assistant');
      return;
    }

    // Add to history
    historyRef.current.push({ role: 'user', content: userText });

    setThinking(true);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // cheap + fast
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...historyRef.current,
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || "I'm sorry, I couldn't process that. Please call us at (516) 510-0267.";
      historyRef.current.push({ role: 'assistant', content: reply });
      addMsg(reply, 'assistant');
    } catch {
      addMsg("Sorry, something went wrong. Please call us at (516) 510-0267 or email uthancare@uthanseniorcare.com.", 'assistant');
    } finally {
      setThinking(false);
    }
  }

  function handleSend(text) {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    if (!name || !email) { setStep('form'); return; }
    addMsg(trimmed, 'user');
    setInput('');
    askAI(trimmed);
    // Also notify via EmailJS
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_uthan',
      import.meta.env.VITE_EMAILJS_TEMPLATE_CHAT || 'template_chat',
      { from_name: name, from_email: email, message: trimmed },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
    ).catch(() => {});
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStep('chat');
    // Send the pending input after collecting info
    const pending = input.trim();
    if (pending) {
      addMsg(pending, 'user');
      setInput('');
      askAI(pending);
    } else {
      addMsg(`Hi, I'm ${name}. I have a question.`, 'user');
      askAI(`Hi, my name is ${name} and I have a question about your services.`);
    }
  }

  return (
    <>
      {/* Trigger bubble */}
      <motion.button
        onClick={() => setOpen(p => !p)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold text-white flex items-center justify-center shadow-xl focus:outline-none"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><IoClose size={24} /></motion.span>
            : <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><IoChatbubbleEllipses size={24} /></motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-white"
            style={{ maxHeight: '560px' }}
          >
            {/* Header */}
            <div className="bg-gold px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FiUser size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Uthan Senior Home Care</p>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <FiZap size={10} /> AI-powered · responds instantly
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-white" style={{ minHeight: 0 }}>
              {step === 'form' ? (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 mt-2">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Before we continue, please share your name and email so we can follow up if needed.
                  </p>
                  <input
                    type="text" placeholder="Your name" value={name} required autoFocus
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="email" placeholder="Your email" value={email} required
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button type="submit" className="w-full py-2.5 rounded-full bg-gold text-white text-sm font-semibold hover:bg-green-dark transition">
                    Continue
                  </button>
                </form>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col gap-0.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {msg.role === 'assistant' && (
                        <span className="text-xs text-gray-400 px-1 mb-0.5 flex items-center gap-1">
                          <FiZap size={10} className="text-gold" /> AI Chatbot
                        </span>
                      )}
                      <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gold text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-xs text-gray-400 px-1">{msg.time}</span>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {thinking && (
                    <div className="flex flex-col gap-0.5 items-start">
                      <span className="text-xs text-gray-400 px-1 mb-0.5 flex items-center gap-1">
                        <FiZap size={10} className="text-gold" /> AI Chatbot
                      </span>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 rounded-full bg-gray-400 block"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick reply chips — show only after welcome */}
                  {messages.length === 1 && !thinking && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {QUICK_REPLIES.map(q => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          className="text-xs bg-gold/10 text-gold border border-gold/20 rounded-full px-3 py-1.5 hover:bg-gold hover:text-white transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            {step === 'chat' && (
              <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2 bg-white">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !thinking && handleSend()}
                  placeholder="Enter your question or message here"
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  disabled={thinking}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || thinking}
                  className="w-9 h-9 rounded-full bg-gold text-white flex items-center justify-center hover:bg-green-dark transition disabled:opacity-40"
                  aria-label="Send"
                >
                  <IoSend size={16} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
