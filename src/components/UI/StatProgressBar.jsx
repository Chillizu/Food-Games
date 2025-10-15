import React from 'react';
import { motion } from 'framer-motion';

const StatProgressBar = ({ label, icon, value, max, higherIsBetter = true, delay = 0 }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const displayValue = Math.round(value * 100);

  const getStatusClass = () => {
    const scoreForColor = higherIsBetter ? percentage : 100 - percentage;
    if (scoreForColor >= 66) return 'is-good';
    if (scoreForColor >= 33) return 'is-medium';
    return 'is-bad';
  };

  return (
    <div className="stat-progress-bar" title={label}>
      <span className="stat-progress-bar__icon">{icon}</span>
      <div className="stat-progress-bar__track">
        <motion.div
          className={`stat-progress-bar__fill ${getStatusClass()}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay }}
        />
      </div>
      <span className="stat-progress-bar__value">{displayValue}</span>
    </div>
  );
};

export default StatProgressBar;