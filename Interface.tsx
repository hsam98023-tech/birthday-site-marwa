import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Star, RotateCcw } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Wish } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from './store';

gsap.registerPlugin(ScrollTrigger);

export const Interface: React.FC = () => {
  const { setHasEntered } = useStore();
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  // Refs for GSAP
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLDivElement>(null);
  const textRef2 = useRef<HTMLDivElement>(null);
  const textRef3 = useRef<HTMLDivElement>(null);

  // Timer State: Time Since 2008
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0 });
  // Timer State: Countdown to 2026
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    // Start Date: Feb 18, 2008
    const startDate = new Date('2008-02-18T00:00:00');
    // Target Date: Feb 18, 2026
    const targetDate = new Date('2026-02-18T00:00:00');

    const tick = () => {
      const now = new Date();
      
      // Calculate Time Since 2008
      const differenceSince = now.getTime() - startDate.getTime();
      const daysSince = Math.floor(differenceSince / (1000 * 60 * 60 * 24));
      const hoursSince = Math.floor((differenceSince / (1000 * 60 * 60)) % 24);
      const minutesSince = Math.floor((differenceSince / 1000 / 60) % 60);
      setTimeElapsed({ days: daysSince, hours: hoursSince, minutes: minutesSince });

      // Calculate Countdown to 2026
      const differenceUntil = targetDate.getTime() - now.getTime();
      if (differenceUntil > 0) {
        const daysUntil = Math.floor(differenceUntil / (1000 * 60 * 60 * 24));
        const hoursUntil = Math.floor((differenceUntil / (1000 * 60 * 60)) % 24);
        const minutesUntil = Math.floor((differenceUntil / 1000 / 60) % 60);
        setTimeRemaining({ days: daysUntil, hours: hoursUntil, minutes: minutesUntil });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0 });
      }
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [
        textRef1.current, 
        textRef2.current, 
        textRef3.current
      ];
      
      elements.forEach((el, index) => {
        if (!el) return;
        
        gsap.fromTo(el, 
          { 
            opacity: 0, 
            y: 80,
            filter: 'blur(10px)'
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
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

    setSending(true);
    try {
      const { error } = await supabase
        .from('Marwa happy birthday')
        .insert([{ sender_name: senderName, Message: message }]);

      if (error) throw error;
      
      setSent(true);
      setSenderName('');
      setMessage('');
      setTimeout(() => setSent(false), 5000); // Reset "sent" state after animation
    } catch (err) {
      console.error('Error sending wish:', err);
      alert('Failed to send wish. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full text-[#1D1D1F] dark:text-white font-inter selection:bg-pink-500 selection:text-white">
      
      {/* SECTION 1: HERO / TIME SINCE */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative p-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center z-10 w-full max-w-4xl px-4"
        >
          <h2 className="text-[#FF2D55] dark:text-pink-300 tracking-[0.3em] text-sm md:text-base uppercase mb-4 font-semibold">
            The Stars Aligned For You
          </h2>
          <h1 className="font-playfair font-bold mb-6 text-glow bg-clip-text text-transparent bg-gradient-to-b from-[#1D1D1F] to-[#FF2D55] dark:from-white dark:to-pink-200"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', lineHeight: 1.1 }}>
            Happy Birthday<br />Marwa
          </h1>
          <p className="text-[#1D1D1F]/70 dark:text-white/70 font-light tracking-wide max-w-lg mx-auto font-playfair italic"
             style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
            "A tapestry woven with love and light"
          </p>

          <div className="mt-10 flex flex-col items-center gap-8 w-full">
            
            {/* Real Time Since Counter (Since 2008) */}
            <div className="flex flex-col items-center w-full">
                <span className="text-xs uppercase tracking-[0.2em] text-[#1D1D1F]/40 dark:text-white/40 mb-2">Since the Beginning</span>
                <div className="flex gap-4 md:gap-8 justify-center w-full max-w-md">
                    <div className="flex flex-col items-center flex-1">
                    <span className="font-cinzel text-[#1D1D1F] dark:text-white" style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' }}>
                        {timeElapsed.days.toLocaleString()}
                    </span>
                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#FF2D55] dark:text-pink-400 mt-2">Days</span>
                    </div>
                    <div className="font-cinzel text-[#1D1D1F]/30 dark:text-white/30 flex items-center" style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' }}>:</div>
                    <div className="flex flex-col items-center flex-1">
                    <span className="font-cinzel text-[#1D1D1F] dark:text-white" style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' }}>
                        {String(timeElapsed.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#FF2D55] dark:text-pink-400 mt-2">Hours</span>
                    </div>
                    <div className="font-cinzel text-[#1D1D1F]/30 dark:text-white/30 flex items-center" style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' }}>:</div>
                    <div className="flex flex-col items-center flex-1">
                    <span className="font-cinzel text-[#1D1D1F] dark:text-white" style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' }}>
                        {String(timeElapsed.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#FF2D55] dark:text-pink-400 mt-2">Minutes</span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="w-12 h-[1px] bg-[#1D1D1F]/10 dark:bg-white/20 my-2"></div>

            {/* Countdown to 2026 */}
             <div className="flex flex-col items-center w-full">
                <span className="text-xs uppercase tracking-[0.2em] text-[#1D1D1F]/40 dark:text-white/40 mb-2">Next Chapter (2026)</span>
                <div className="flex gap-4 md:gap-6 justify-center scale-90 opacity-90 w-full max-w-sm">
                    <div className="flex flex-col items-center flex-1">
                    <span className="font-cinzel text-purple-600 dark:text-purple-200" style={{ fontSize: 'clamp(1.2rem, 4vw, 2.25rem)' }}>
                        {timeRemaining.days.toLocaleString()}
                    </span>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-purple-500 dark:text-purple-400 mt-1">Days</span>
                    </div>
                    <div className="font-cinzel text-[#1D1D1F]/20 dark:text-white/20 flex items-center" style={{ fontSize: 'clamp(1.2rem, 4vw, 2.25rem)' }}>:</div>
                    <div className="flex flex-col items-center flex-1">
                    <span className="font-cinzel text-purple-600 dark:text-purple-200" style={{ fontSize: 'clamp(1.2rem, 4vw, 2.25rem)' }}>
                        {String(timeRemaining.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-purple-500 dark:text-purple-400 mt-1">Hours</span>
                    </div>
                    <div className="font-cinzel text-[#1D1D1F]/20 dark:text-white/20 flex items-center" style={{ fontSize: 'clamp(1.2rem, 4vw, 2.25rem)' }}>:</div>
                    <div className="flex flex-col items-center flex-1">
                    <span className="font-cinzel text-purple-600 dark:text-purple-200" style={{ fontSize: 'clamp(1.2rem, 4vw, 2.25rem)' }}>
                        {String(timeRemaining.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-purple-500 dark:text-purple-400 mt-1">Min</span>
                    </div>
                </div>
            </div>

          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 text-[#1D1D1F]/40 dark:text-white/40 text-sm uppercase tracking-widest"
        >
          Scroll to Explore
        </motion.div>
      </section>

      {/* SECTION 2: EMOTIONAL JOURNEY (GSAP Enhanced) */}
      <section ref={sectionRef} className="min-h-screen w-full flex flex-col items-center justify-center relative py-24 md:py-40">
        <div className="w-full max-w-[90%] md:max-w-4xl mx-auto space-y-32 md:space-y-48 px-4 md:px-0">
          
          <div ref={textRef1} className="space-y-6 opacity-0 flex flex-col items-center">
            <p className="font-playfair font-medium text-[#1D1D1F] dark:text-pink-100 text-center leading-relaxed break-words text-balance" 
               style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}
               dir="rtl">
              "عيد ميلادك ليس مجرد يوم، بل هو اليوم الذي وُلدت فيه سعادتي 💗"
            </p>
            <div className="space-y-2 max-w-lg mx-auto text-center w-full">
                <p className="text-xs md:text-sm text-[#1D1D1F]/40 dark:text-white/40 uppercase tracking-[0.2em] font-inter">Translation</p>
                <p className="font-playfair italic text-[#1D1D1F]/70 dark:text-white/70 leading-relaxed text-balance"
                   style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                "Your birthday is not just a day; it is the day my happiness was born."
                </p>
            </div>
          </div>

          <div ref={textRef2} className="space-y-6 opacity-0 flex flex-col items-center">
            <p className="font-playfair font-medium text-[#1D1D1F] dark:text-pink-100 text-center leading-relaxed break-words text-balance"
               style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}
               dir="rtl">
              "في يوم ميلادك، لا أحتفل فقط بعامٍ جديد من عمرك، بل أحتفل بوجودك في حياتي"
            </p>
             <p className="font-playfair italic text-[#1D1D1F]/70 dark:text-white/70 text-center leading-relaxed max-w-xl mx-auto text-balance"
                style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
              "On your birthday, I don't just celebrate a new year of your life, I celebrate your existence in mine."
            </p>
          </div>

          <div ref={textRef3} className="space-y-8 opacity-0 flex flex-col items-center">
            <p className="font-playfair font-bold text-amber-500 text-glow-gold dark:text-yellow-100 text-center leading-tight break-words text-balance"
               style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
               dir="rtl">
              "كل عام وأنتِ نبضي الذي لا يهدأ"
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FF2D55] dark:via-pink-500 to-transparent mx-auto"></div>
          </div>

        </div>
      </section>

      {/* SECTION 3: WISH WALL */}
      <section className="h-screen w-full flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-100/40 dark:via-purple-900/10 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#FF2D55] dark:bg-pink-500 rounded-full blur-[60px] opacity-40"></div>
          
          <h2 className="text-3xl font-playfair text-center mb-2 text-[#1D1D1F] dark:text-white">Make a Wish</h2>
          <p className="text-center text-[#1D1D1F]/60 dark:text-white/60 text-sm mb-8 font-light">Send a secret message to the universe for Marwa</p>

          {sent ? (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="flex flex-col items-center py-10"
            >
              <div className="w-16 h-16 bg-[#FF2D55] dark:bg-pink-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,45,85,0.6)] dark:shadow-[0_0_30px_rgba(255,0,127,0.6)] mb-4">
                <Star className="text-white w-8 h-8 fill-white" />
              </div>
              <h3 className="text-2xl font-playfair text-[#FF2D55] dark:text-pink-300">Sent to the Stars!</h3>
              <p className="text-[#1D1D1F]/50 dark:text-white/50 text-sm mt-2">Your wish is now part of the galaxy.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#FF2D55] dark:text-pink-300 ml-1">Your Name</label>
                <input 
                  type="text" 
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full p-4 rounded-xl glass-input placeholder-[#1D1D1F]/20 dark:placeholder-white/20"
                  placeholder="Who is this from?"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#FF2D55] dark:text-pink-300 ml-1">Your Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl glass-input placeholder-[#1D1D1F]/20 dark:placeholder-white/20 h-32 resize-none"
                  placeholder="Write your secret wish..."
                  required
                />
              </div>
              <button 
                disabled={sending}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF2D55] to-purple-600 dark:from-pink-600 dark:to-purple-600 hover:opacity-90 text-white font-semibold tracking-wide shadow-lg shadow-pink-500/30 dark:shadow-pink-900/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : <>Send Wish <Send size={18} /></>}
              </button>
            </form>
          )}
        </motion.div>
        
        <footer className="absolute bottom-6 w-full text-center flex flex-col items-center gap-2">
            <button 
                onClick={() => setHasEntered(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[#1D1D1F]/60 dark:text-white/60 hover:text-[#FF2D55] dark:hover:text-pink-400 hover:bg-[#FF2D55]/10 dark:hover:bg-pink-500/10 transition-all text-xs tracking-widest uppercase mb-2 group"
            >
                <RotateCcw size={12} className="group-hover:-rotate-180 transition-transform duration-500" />
                اعاده التجربة
            </button>
            <p className="text-[#1D1D1F]/20 dark:text-white/20 text-xs tracking-widest uppercase">Created with Love • 2024</p>
        </footer>
      </section>
    </div>
  );
};
