import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LoadingScreen({ isApiLoading = false }: { isApiLoading?: boolean }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isApiLoading) {
      // Wait for at least 2.5 seconds total before hiding
      const timer = setTimeout(() => {
        setShow(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isApiLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#020617', // Match your dark theme
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
              fontWeight: 900, 
              color: '#f8fafc', 
              letterSpacing: '-0.02em', 
              display: 'flex', 
              alignItems: 'center' 
            }}
          >
            SRILAM
            <motion.span 
              initial={{ color: '#f8fafc' }}
              animate={{ color: '#38bdf8' }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              BO.
            </motion.span>
          </motion.div>

          {/* Progress bar container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              marginTop: '2rem',
              width: 200,
              height: 2,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* The animated progress fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 2, ease: "circOut" }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #38bdf8, #818cf8)'
              }}
            />
            {/* Glowing effect head */}
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: 200 }}
              transition={{ duration: 2, ease: "circOut" }}
              style={{
                position: 'absolute',
                top: -5,
                width: 10,
                height: 10,
                background: '#38bdf8',
                borderRadius: '50%',
                boxShadow: '0 0 10px 2px rgba(56,189,248,0.8)'
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
