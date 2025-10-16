import React from 'react';
import { motion } from 'framer-motion';

const StatProgressBar = ({ label, icon, value, max, higherIsBetter = true, delay = 0 }) => {
  // 确保 value 和 max 是有效的数字
  const numericValue = Number(value) || 0;
  const numericMax = Number(max) || 1;

  // 1. 计算百分比，并严格限制在 0-100 之间
  const percentage = Math.min(Math.max((numericValue / numericMax) * 100, 0), 100);

  // 2. 决定显示的数值（保留两位小数）
  const displayValue = numericValue.toFixed(2);

  // 3. 根据百分比决定颜色状态
  const getStatusClass = () => {
    const score = higherIsBetter ? percentage : 100 - percentage;
    if (score >= 66) return 'is-good';
    if (score >= 33) return 'is-medium';
    return 'is-bad';
  };

  return (
    <div className="stat-progress-bar" title={`${label}: ${displayValue} / ${numericMax}`}>
      <span className="stat-progress-bar__icon">{icon}</span>
      <div className="stat-progress-bar__track">
        <motion.div
          className={`stat-progress-bar__fill ${getStatusClass()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay }}
        />
      </div>
      <span className="stat-progress-bar__value">{displayValue}</span>
    </div>
  );
};

export default StatProgressBar;