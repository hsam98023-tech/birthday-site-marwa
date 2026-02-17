import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useStore } from '@/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Interface: React.FC = () => {
  const { setHasEntered } = useStore();
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

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

  // GSAP Animation with fixed opacity
  useEffect(() => {
    const ctx = gsap.context(() => {
      textRefs.forEach((ref) => {
        if (!ref.current) return;
        gsap.fromTo(ref.current, 
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1.2,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              end: 'bottom 20%',
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
    try {
      await supabase.from('Marwa happy birthday').insert([{ sender_name: senderName, Message: message }]);
      setSent(true);
    } catch (err) { alert('Error!'); }
  };

  return (
    <div className="w-full font-inter relative z-10">
      
      {/* SECTION 1: HERO & TIMER */}
      <section className="h-screen w-full flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-playfair text-5xl md:text-7xl mb-4 text-pink-600 dark:text-pink-300 drop-shadow-sm">
            Happy Birthday, Marwa.
          </h1>
          
          <div className="flex gap-4 justify-center mt-6 bg-white/40 dark:bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl">
            <div className="flex flex-col"><span className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white">{timeElapsed.days}</span><span className="text-[10px] text-gray-500 uppercase">Days</span></div>
            <div className="text-3xl text-pink-500">:</div>
            <div className="flex flex-col"><span className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white">{String(timeElapsed.hours).padStart(2,'0')}</span><span className="text-[10px] text-gray-500 uppercase">Hours</span></div>
            <div className="text-3xl text-pink-500">:</div>
            <div className="flex flex-col"><span className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white">{String(timeElapsed.minutes).padStart(2,'0')}</span><span className="text-[10px] text-gray-500 uppercase">Mins</span></div>
          </div>
          <p className="mt-8 text-gray-400 dark:text-white/40 text-xs uppercase tracking-widest">Scroll down to read</p>
        </motion.div>
      </section>

      {/* SECTION 2: THE MESSAGES (المكان فين كان المشكل) */}
      <section ref={sectionRef} className="w-full py-20 px-6 space-y-[50vh] flex flex-col items-center bg-transparent">
        
        <div ref={textRefs[0]} className="max-w-2xl text-center">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed italic text-gray-800 dark:text-pink-100">
            "Wherever life takes you, I hope you always find your way toward what gives you peace and satisfaction."
          </p>
        </div>

        <div ref={textRefs[1]} className="max-w-2xl text-center">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed text-gray-800 dark:text-white/90">
            "Every year adds something new to who you are, and I hope this year adds something meaningful."
          </p>
        </div>

        <div ref={textRefs[2]} className="max-w-2xl text-center">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed italic text-gray-800 dark:text-purple-200">
            "I hope this day brings you moments of calm, genuine smiles, and memories worth keeping."
          </p>
        </div>

        <div ref={textRefs[3]} className="max-w-2xl text-center pb-40">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed text-gray-800 dark:text-white/90">
            "Birthdays are about realizing how far you’ve come... I wish you a year filled with progress and clarity."
          </p>
        </div>
      </section>

      {/* SECTION 3: WISH WALL */}
      <section className="min-h-screen flex items-center justify-center p-6">
        <div className="p-8 rounded-3xl max-w-md w-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-2xl shadow-2xl">
          <h2 className="text-3xl font-playfair text-center mb-6 text-gray-800 dark:text-white">Make a Wish</h2>
          {sent ? (
            <div className="text-center py-10 text-pink-600 font-bold">Your wish is sent! ✨</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your Name" className="w-full p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white outline-none" required />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your Message" className="w-full p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white h-32 outline-none" required />
              <button className="w-full py-4 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-all shadow-lg">Send Wish</button>
            </form>
          )}
          <button onClick={() => setHasEntered(false)} className="w-full mt-6 text-gray-400 text-xs uppercase flex items-center justify-center gap-2">
            <RotateCcw size={12} /> Restart Experience
          </button>
        </div>
      </section>
    </div>
  );
};
