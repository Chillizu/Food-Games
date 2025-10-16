import React from 'react';
import { motion } from 'framer-motion';
import './ModernProgressBar.css';

const ModernProgressBar = ({ label, value, max, icon, delay = 0, compact = false }) => {
  // 确保值在合理范围内
  const safeValue = Math.max(0, Math.min(value, max));
  const percentage = max > 0 ? (safeValue / max) * 100 : 0;

  const fillerVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${percentage}%`,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        delay: delay + 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: delay,
      },
    },
  };

  const containerClasses = `modern-progress-bar-container ${compact ? 'compact' : ''}`;

  return (
    <motion.div className={containerClasses} variants={textVariants} initial="hidden" animate="visible">
      <div className="progress-bar-header">
        <span className="progress-bar-icon">{icon}</span>
        <span className="progress-bar-label">{label}</span>
        {!compact && <span className="progress-bar-value">{Math.round(safeValue * 10) / 10} / {max}</span>}
      </div>
      <div className="progress-bar-track">
        <motion.div
          className="progress-bar-filler"
          variants={fillerVariants}
          initial="hidden"
          animate="visible"
        />
      </div>
    </motion.div>
  );
};

export default ModernProgressBar;