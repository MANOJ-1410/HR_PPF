import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true, text = "Loading..." }) => {
  return (
    <div className={`
      ${fullScreen ? 'fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md' : 'w-full py-20'}
      flex flex-col items-center justify-center
    `}>
      <div className="relative">
        {/* Main outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-slate-100 border-t-mv-navy rounded-full shadow-sm"
        />
        
        {/* Inner pulsing circle */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-8 h-8 bg-mv-navy/10 rounded-full"
        />
      </div>

      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-sm font-black text-mv-navy uppercase tracking-[0.2em]"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
