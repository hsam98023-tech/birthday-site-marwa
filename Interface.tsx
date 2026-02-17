import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Star, RotateCcw } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useStore } from '@/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Interface: React.FC = () => {
  const { setHasEntered } = useStore();
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const textRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Timer Logic (إرجاع المؤقت)
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

  // Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      textRefs.forEach((ref) => {
        if (!ref.current) return;
        gsap.fromTo(ref.current, 
          { opacity: 0, y: 50, filter: 'blur(10px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !message) return;
    setSending(true);
    try {
      await supabase.from('Marwa happy birthday').insert([{ sender_name: senderName, Message: message }]);
      setSent(true);
    } catch (err) { alert('Error!'); }
    finally { setSending(false); }
  };

  return (
    <div className="w-full text-white font-inter bg-transparent">
      
      {/* SECTION 1: HERO & TIMER (الرجوع للأصل) */}
      <section className="h-screen w-full flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <h1 className="font-playfair text-5xl md:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-pink-300">
            Happy Birthday, Marwa.
          </h1>
          
          {/* إظهار المؤقت بشكل أوضح */}
          <div className="flex gap-6 justify-center mt-8 backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex flex-col">
              <span className="text-3xl md:text-5xl font-cinzel text-pink-400">{timeElapsed.days}</span>
              <span className="text-[10px] uppercase tracking-widest opacity-50">Days</span>
            </div>
            <div className="text-3xl opacity-20">:</div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-5xl font-cinzel text-pink-400">{String(timeElapsed.hours).padStart(2,'0')}</span>
              <span className="text-[10px] uppercase tracking-widest opacity-50">Hours</span>
            </div>
            <div className="text-3xl opacity-20">:</div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-5xl font-cinzel text-pink-400">{String(timeElapsed.minutes).padStart(2,'0')}</span>
              <span className="text-[10px] uppercase tracking-widest opacity-50">Mins</span>
            </div>
          </div>
          <p className="mt-10 text-white/30 text-xs uppercase tracking-[0.4em] animate-pulse">Scroll to Read Your Messages</p>
        </motion.div>
      </section>

      {/* SECTION 2: MESSAGES (الرسائل اللي بغيتي) */}
      <section ref={sectionRef} className="w-full py-20 px-6 space-y-[40vh] flex flex-col items-center">
        
        <div ref={textRefs[0]} className="max-w-2xl text-center">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed italic text-pink-200">
            "Wherever life takes you, I hope you always find your way toward what gives you peace and satisfaction."
          </p>
        </div>

        <div ref={textRefs[1]} className="max-w-2xl text-center">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed text-white/80">
            "Every year adds something new to who you are, and I hope this year adds something meaningful. I wish you well in the year ahead."
          </p>
        </div>

        <div ref={textRefs[2]} className="max-w-2xl text-center">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed italic text-purple-300">
            "I hope this day brings you moments of calm, genuine smiles, and memories worth keeping."
          </p>
        </div>

        <div ref={textRefs[3]} className="max-w-2xl text-center pb-40">
          <p className="font-playfair text-xl md:text-3xl leading-relaxed text-white/70">
            "Birthdays are not just about getting older, but about realizing how far you’ve come... I wish you a year filled with progress, clarity, and potential."
          </p>
        </div>
      </section>

      {/* SECTION 3: WISH WALL */}
      <section className="h-screen flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-white/10 bg-black/40 backdrop-blur-xl">
          <h2 className="text-3xl font-playfair text-center mb-6 text-white">Make a Wish</h2>
          {sent ? (
            <div className="text-center py-10 animate-bounce text-pink-400 font-bold">Sent to the stars! ✨</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your Name" className="w-full p-4 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-pink-500 transition-all" required />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your Message" className="w-full p-4 bg-white/5 rounded-xl border border-white/10 h-32 outline-none focus:border-pink-500 transition-all" required />
              <button className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold shadow-lg shadow-pink-500/20 hover:scale-[1.02] transition-transform">Send Wish</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
