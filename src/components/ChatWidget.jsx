import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChatbubbleEllipses, IoClose, IoSend } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

const WELCOME = {
  id: 'welcome',
  from: 'agent',
  text: "Hi! 👋 Welcome to Uthan Senior Home Care. Let me know if you have any questions!",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('chat'); // 'chat' | 'form'
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function addMessage(text, from = 'user') {
    setMessages(prev => [...prev, {
      id: Date.now(),
      from,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!name || !email) { setStep('form'); return; }
    addMessage(trimmed);
    setInput('');
    // Auto-reply
    setTimeout(() => {
      addMessage("Thank you for your message! Our team will follow up with you shortly. You can also call us at (516) 510-0267.", 'agent');
    }, 800);
    // Send via EmailJS
    emailjs.send('service_uthan', 'template_chat', {
      from_name: name,
      from_email: email,
      message: trimmed,
    }, 'YOUR_PUBLIC_KEY').catch(() => {});
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStep('chat');
    setSent(true);
    addMessage(`Hi, I'm ${name}. ${input}`, 'user');
    setInput('');
    setTimeout(() => {
      addMessage(`Nice to meet you, ${name}! Our team will get back to you at ${email} shortly.`, 'agent');
    }, 800);
  }

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen(p => !p)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold text-white flex items-center justify-center shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open
            ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><IoClose size={24} /></motion.span>
            : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><IoChatbubbleEllipses size={24} /></motion.span>
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
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '520px' }}
          >
            {/* Header */}
            <div className="bg-gold px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FiUser size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Uthan Senior Home Care</p>
                <p className="text-white/75 text-xs">We'll respond as soon as we can</p>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
              {step === 'form' ? (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 mt-2">
                  <p className="text-sm text-gray-600">Before we continue, please share your name and email so we can follow up.</p>
                  <input
                    type="text" placeholder="Your name" value={name} required
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
                messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col gap-0.5 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-gold text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-400 px-1">{msg.time}</span>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {step === 'chat' && (
              <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message…"
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-full bg-gold text-white flex items-center justify-center hover:bg-green-dark transition disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Send message"
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

export default ChatWidget;
