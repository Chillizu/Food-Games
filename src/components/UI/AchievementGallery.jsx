import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAchievements } from '../../utils/dataProcessing';
import { IconX } from '@tabler/icons-react';

const AchievementGallery = ({ show, onClose, unlockedAchievementIds }) => {
  const allAchievements = getAchievements();

  // Control body scroll when modal is open
  useEffect(() => {
    if (show) {
      // Add modal-open class to body to prevent scrolling
      document.body.classList.add('modal-open');
    } else {
      // Remove modal-open class from body to restore scrolling
      document.body.classList.remove('modal-open');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [show]);

  const isUnlocked = (achievementId) => unlockedAchievementIds.includes(achievementId);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="achievement-gallery-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="achievement-gallery-modal"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">🏆 成就殿堂</h2>
              <button className="close-button" onClick={onClose}><IconX size={28} /></button>
            </div>
            <div className="achievement-gallery-grid">
              {allAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`achievement-gallery-item ${isUnlocked(achievement.id) ? 'unlocked' : 'locked'}`}
                  title={isUnlocked(achievement.id) ? achievement.description : '未解锁'}
                >
                  <div className="achievement-gallery-icon">{isUnlocked(achievement.id) ? achievement.icon : '❓'}</div>
                  <div className="achievement-gallery-name">{isUnlocked(achievement.id) ? achievement.name : '神秘成就'}</div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              已解锁: {unlockedAchievementIds.length} / {allAchievements.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementGallery;