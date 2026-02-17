import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useStore } from '@/store';

export const Interface: React.FC = () => {
  const { setHasEntered } = useStore();
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // Timer Logic
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0 });
  useEffect(() => {
    const startDate = new Date('2008-02-18T00:00:00');
    const tick = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      setTimeElapsed({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60)
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !message) return;
    try {
      await supabase.from('Marwa happy birthday').insert([{ sender_name: senderName, Message: message }]);
      setSent(true);
    } catch (err) { alert('Error!'); }
  };

  return (
    <div className="w-full relative z-[999]">
      
      {/* SECTION 1: HERO & TIMER */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-playfair text-5xl md:text-7xl mb-4 text-pink-500 font-bold">
          Happy Birthday, Marwa.
        </h1>
        
        <div className="flex gap-4 justify-center mt-6 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl">
          <div className="flex flex-col"><span className="text-4xl md:text-5xl font-bold text-white">{timeElapsed.days}</span><span className="text-[10px] text-pink-300 uppercase">Days</span></div>
          <div className="text-3xl text-pink-500">:</div>
          <div className="flex flex-col"><span className="text-4xl md:text-5xl font-bold text-white">{String(timeElapsed.hours).padStart(2,'0')}</span><span className="text-[10px] text-pink-300 uppercase">Hours</span></div>
          <div className="text-3xl text-pink-500">:</div>
          <div className="flex flex-col"><span className="text-4xl md:text-5xl font-bold text-white">{String(timeElapsed.minutes).padStart(2,'0')}</span><span className="text-[10px] text-pink-300 uppercase">Mins</span></div>
        </div>
        <p className="mt-8 text-white/60 text-xs uppercase tracking-[0.4em] animate-bounce">Scroll down to read</p>
      </section>

      {/* SECTION 2: THE MESSAGES (استعمال Framer Motion عوض GSAP لضمان الرؤية) */}
      <section className="w-full py-20 px-6 space-y-[60vh] flex flex-col items-center">
        
        {[
          { text: "Wherever life takes you, I hope you always find your way toward what gives you peace and satisfaction.", color: "text-pink-100" },
          { text: "Every year adds something new to who you are, and I hope this year adds something meaningful. I wish you well in the year ahead.", color: "text-white" },
          { text: "I hope this day brings you moments of calm, genuine smiles, and memories worth keeping.", color: "text-purple-200" },
          { text: "Birthdays are not just about getting older, but about realizing how far you’ve come... I wish you a year filled with progress, clarity, and potential.", color: "text-white/90" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-center"
          >
            <p className={`font-playfair text-2xl md:text-4xl leading-relaxed italic ${item.color}`}>
              "{item.text}"
            </p>
          </motion.div>
        ))}
      </section>

      {/* SECTION 3: WISH WALL */}
      <section className="min-h-screen flex items-center justify-center p-6">
        <div className="p-8 rounded-3xl max-w-md w-full border border-white/20 bg-black/60 backdrop-blur-2xl shadow-2xl">
          <h2 className="text-3xl font-playfair text-center mb-6 text-white">Make a Wish</h2>
          {sent ? (
            <div className="text-center py-10 text-pink-400 font-bold">Your wish is flying to the stars! ✨</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your Name" className="w-full p-4 bg-white/10 rounded-xl border border-white/10 text-white outline-none focus:border-pink-500" required />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your Message" className="w-full p-4 bg-white/10 rounded-xl border border-white/10 text-white h-32 outline-none focus:border-pink-500" required />
              <button className="w-full py-4 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-all">Send Wish</button>
            </form>
          )}
          <button onClick={() => setHasEntered(false)} className="w-full mt-6 text-white/30 text-xs uppercase flex items-center justify-center gap-2">
            <RotateCcw size={12} /> Restart
          </button>
        </div>
      </section>
    </div>
  );
};
