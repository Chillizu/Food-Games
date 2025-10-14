import React from 'react';
import { motion } from 'framer-motion';
import { IconBook, IconAward } from '@tabler/icons-react';
import styles from './HeaderActions.module.css';

const HeaderActions = ({ onCookbookClick, onAchievementsClick }) => {
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className={styles.container}>
      <motion.button
        className={styles.actionButton}
        onClick={onCookbookClick}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        title="打开图鉴"
      >
        <IconBook size={20} />
        <span>图鉴</span>
      </motion.button>
      <motion.button
        className={styles.actionButton}
        onClick={onAchievementsClick}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        title="查看成就"
      >
        <IconAward size={20} />
        <span>成就</span>
      </motion.button>
    </div>
  );
};

export default HeaderActions;