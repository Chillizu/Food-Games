import React from 'react';
import { motion } from 'framer-motion';

const HeaderActions = ({ onCookbookClick, onAchievementsClick }) => {
  return (
    <div className="header-actions">
      <motion.button
        className="button-icon"
        onClick={onCookbookClick}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        title="打开图鉴"
      >
        📖
      </motion.button>
      <motion.button
        className="button-icon"
        onClick={onAchievementsClick}
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        title="查看成就"
      >
        🏆
      </motion.button>
    </div>
  );
};

export default HeaderActions;