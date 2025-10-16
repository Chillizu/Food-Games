import React from 'react';
import { motion } from 'framer-motion';
import ModernProgressBar from './ModernProgressBar';
import './FloatingStatsPanel.css';

const FloatingStatsPanel = ({ stats, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  const panelVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div 
      className="floating-stats-panel"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <h3 className="panel-title">当前选择影响</h3>
      <div className="panel-content">
        <ModernProgressBar
          label="总碳排放"
          icon="🌍"
          value={stats.carbonFootprint}
          max={2.5}
          delay={0.1}
        />
        <ModernProgressBar
          label="总水资源消耗"
          icon="💧"
          value={stats.waterUsage}
          max={2.5}
          delay={0.2}
        />
        <ModernProgressBar
          label="平均健康指数"
          icon="❤️"
          value={stats.healthScore}
          max={1}
          delay={0.3}
        />
      </div>
    </motion.div>
  );
};

export default FloatingStatsPanel;