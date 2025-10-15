import React from 'react';
import { motion } from 'framer-motion';
import StatProgressBar from './StatProgressBar';

const SelectionStatsPanel = ({ selectionStats }) => {
  const stats = selectionStats || {
    carbonFootprint: 0,
    waterUsage: 0,
    healthScore: 0,
  };

  return (
    <motion.div
      className="selection-stats-panel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
    >
      <h3 className="stats-title">当前选择总览</h3>
      <div className="stats-progress-bars">
        <StatProgressBar
          label="总碳排放"
          icon="🌍"
          value={stats.carbonFootprint}
          max={2}
          higherIsBetter={false}
          delay={0.1}
        />
        <StatProgressBar
          label="总水资源消耗"
          icon="💧"
          value={stats.waterUsage}
          max={2}
          higherIsBetter={false}
          delay={0.2}
        />
        <StatProgressBar
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

export default SelectionStatsPanel;