import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingEmojis = ({ emojis }) => {
  const emojiVariants = useMemo(() => emojis.map(() => ({
    float: {
      y: [Math.random() * -40 - 20, Math.random() * 40 + 20],
      x: [Math.random() * -30 - 10, Math.random() * 30 + 10],
      rotate: [Math.random() * -50, Math.random() * 50],
      transition: {
        duration: Math.random() * 15 + 20,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
    drift: {
      x: [Math.random() * -10, Math.random() * 10],
      y: [Math.random() * -10, Math.random() * 10],
      transition: {
        duration: Math.random() * 5 + 10,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'linear',
      }
    }
  })), [emojis]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {emojis.map((emoji, index) => (
        <motion.span
          key={index}
          variants={emojiVariants[index]}
          animate={["float", "drift"]}
          style={{
            position: 'absolute',
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            fontSize: `${Math.random() * 2 + 1.5}rem`,
            opacity: Math.random() * 0.5 + 0.3,
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingEmojis;