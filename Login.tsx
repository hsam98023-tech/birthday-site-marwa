import React, { useState } from 'react';
import { useStore } from './store'; // تم تغيير المسار من ../store إلى ./store
import { motion } from 'framer-motion';
import { Lock, Heart } from 'lucide-react';

export const Login: React.FC = () => {
  const { setHasEntered } = useStore();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate cinematic delay
    setTimeout(() => {
        setHasEntered(true);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
    >
      <div className="w-full max-w-sm pointer-events-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mb-10"
        >
          <div className="inline-block p-4 rounded-full bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 mb-6 shadow-[0_0_30px_rgba(255,45,85,0.2)] dark:shadow-[0_0_30px_rgba(255,0,127,0.2)] backdrop-blur-md">
            <span className="text-2xl font-cinzel text-[#FF2D55] dark:text-pink-400 font-bold">M</span>
          </div>
          <h1 className="text-4xl font-playfair text-[#1D1D1F] dark:text-white mb-2">Welcome Marwa 💗</h1>
        </motion.div>

        <form onSubmit={handleLogin} className="glass-panel p-8 rounded-3xl space-y-6 relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 dark:bg-purple-600/20 blur-[50px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 dark:bg-pink-600/20 blur-[50px] rounded-full"></div>

            <div className="space-y-4 relative z-10">
                <div className="space-y-1">
                    <label className="text-xs uppercase text-[#1D1D1F]/50 dark:text-white/50 tracking-wider ml-2">Username</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            disabled 
                            value="Marwa" 
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-3 pl-10 text-[#1D1D1F] dark:text-white font-medium focus:outline-none cursor-not-allowed opacity-70" 
                        />
                        <div className="absolute left-3 top-3.5 text-[#1D1D1F]/30 dark:text-white/30">
                            <Heart size={16} fill="currentColor" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs uppercase text-[#1D1D1F]/50 dark:text-white/50 tracking-wider ml-2">Password</label>
                    <div className="relative">
                        <input 
                            type="password" 
                            disabled 
                            value="********" 
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-3 pl-10 text-[#1D1D1F] dark:text-white font-medium focus:outline-none cursor-not-allowed opacity-70" 
                        />
                        <div className="absolute left-3 top-3.5 text-[#1D1D1F]/30 dark:text-white/30">
                            <Lock size={16} />
                        </div>
                    </div>
                </div>
            </div>

            <button 
                type="submit" 
                className="relative z-10 w-full bg-gradient-to-r from-[#FF2D55] to-purple-600 dark:from-pink-500 dark:to-purple-600 p-4 rounded-xl text-white font-bold tracking-widest shadow-[0_4px_20px_rgba(255,45,85,0.4)] dark:shadow-[0_4px_20px_rgba(236,72,153,0.4)] hover:shadow-[0_4px_30px_rgba(255,45,85,0.6)] dark:hover:shadow-[0_4px_30px_rgba(236,72,153,0.6)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
            >
                {loading ? (
                    <span className="animate-pulse">ENTERING...</span>
                ) : (
                    <>
                       <Heart size={18} className="group-hover:fill-white transition-all duration-500" /> LOGIN
                    </>
                )}
            </button>
        </form>
      </div>
    </motion.div>
  );
};
