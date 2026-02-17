import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { motion } from 'framer-motion';
import { ArrowDown, Send } from 'lucide-react';
import { supabase } from './supabaseClient';

export const Interface: React.FC = () => {
  const { isDarkMode } = useStore();
  const [wish, setWish] = useState("");
  const [sender, setSender] = useState("");
  const [sent, setSent] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState({
    years: 0, days: 0, hours: 0, mins: 0, secs: 0
  });

  useEffect(() => {
    // حساب الوقت من تاريخ ميلاد مروة
    const birthDate = new Date('2008-02-18T00:00:00');
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - birthDate.getTime();
      let totalYears = now.getFullYear() - birthDate.getFullYear();
      if (now.getMonth() < birthDate.getMonth() || (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())) {
        totalYears--;
      }
      setTimeLeft({
        years: totalYears,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    // إرسال الأمنية لجدول Supabase
    const { error } = await supabase.from('Marwa happy birthday').insert([{ sender_name: sender, message: wish }]);
    if (!error) { setSent(true); setWish(""); setSender(""); }
  };

  return (
    <div className="relative z-20 w-full overflow-y-auto scroll-smooth h-screen">
      {/* SECTION 1: HERO & COUNTDOWN */}
      <section className="h-screen flex flex-col items-center justify-center px-4 shrink-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center">
          <h1 className="text-5xl md:text-7xl font-playfair text-[#1D1D1F] dark:text-white mb-8">
            Happy Birthday, <span className="text-[#FF2D55] dark:text-pink-500">Marwa.</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            <TimeUnit label="YEARS" value={timeLeft.years} />
            <TimeUnit label="DAYS" value={timeLeft.days} />
            <TimeUnit label="HOURS" value={timeLeft.hours} />
            <TimeUnit label="MINS" value={timeLeft.mins} />
            <TimeUnit label="SECS" value={timeLeft.secs} isHighlight />
          </div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-20 opacity-50 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#1D1D1F] dark:text-white">Scroll down to read</span>
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: THE TWO SPECIFIC MESSAGES */}
      <section className="min-h-screen flex flex-col items-center justify-center space-y-48 py-32 px-6 max-w-4xl mx-auto">
        
        {/* الرسالة الأولى */}
        <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 50 }} transition={{ duration: 1 }} className="space-y-8 text-center">
            <h2 className="text-4xl md:text-5xl font-playfair text-[#FF2D55] dark:text-pink-500">Happy Birthday, Marwa.</h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-[#1D1D1F] dark:text-white/80 italic">
                "I hope this day brings you moments of calm, genuine smiles, and memories worth keeping. Birthdays are not just about getting older, but about realizing how far you’ve come, everything you’ve learned, and the strength you’ve built along the way. I wish you a year filled with progress, clarity, and opportunities that match your effort and potential."
            </p>
        </motion.div>

        {/* الرسالة الثانية */}
        <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 50 }} transition={{ duration: 1 }} className="space-y-8 text-center">
            <h2 className="text-4xl md:text-5xl font-playfair text-[#FF2D55] dark:text-pink-500">Happy Birthday, Marwa.</h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-[#1D1D1F] dark:text-white/80 italic">
                "Wherever life takes you, I hope you always find your way toward what gives you peace and satisfaction. Every year adds something new to who you are, and I hope this year adds something meaningful. I wish you well in the year ahead."
            </p>
        </motion.div>

      </section>

      {/* SECTION 3: SECRET WISH (SUPABASE) */}
      <section className="min-h-screen flex items-center justify-center p-6 shrink-0">
        <motion.div whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.9 }} className="glass-panel p-8 md:p-12 rounded-[2rem] w-full max-w-lg border border-white/10 shadow-2xl backdrop-blur-2xl bg-white/5">
          <h2 className="text-3xl font-playfair text-white mb-8 flex items-center gap-3 font-bold">
            <Send size={24} className="text-pink-500" /> Leave a Secret Wish
          </h2>
          {sent ? (
            <div className="text-center p-8 text-pink-400 font-medium text-xl">Thank you! Your wish is now part of the stars ✨</div>
          ) : (
            <form onSubmit={handleSubmitWish} className="space-y-6">
              <input type="text" placeholder="Your Name" required value={sender} onChange={(e) => setSender(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
              <textarea placeholder="Your secret wish..." required value={wish} onChange={(e) => setWish(e.target.value)} rows={5}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 p-5 rounded-2xl text-white font-bold tracking-[0.2em] shadow-lg hover:brightness-110 transition-all">
                SEND TO THE STARS
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
};

const TimeUnit = ({ label, value, isHighlight = false }: any) => (
  <div className="flex flex-col items-center min-w-[70px] md:min-w-[100px] bg-white/5 backdrop-blur-md border border-white/10 p-4 md:p-5 rounded-2xl">
    <span className={`text-2xl md:text-4xl font-bold ${isHighlight ? 'text-pink-500 animate-pulse' : 'text-white'}`}>{value.toLocaleString()}</span>
    <span className="text-[9px] md:text-[11px] text-white/40 tracking-[0.2em] mt-2 font-medium">{label}</span>
  </div>
);
