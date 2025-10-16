import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAchievements } from '../../utils/dataProcessing';
import { IconX } from '@tabler/icons-react';

const AchievementGallery = ({ show, onClose, unlockedAchievementIds }) => {
  const allAchievements = getAchievements();

  // Control body scroll when modal is open - COMPLETELY REWRITTEN
  useEffect(() => {
    if (show) {
      // Add modal-open class to body to prevent scrolling
      document.body.classList.add('modal-open');
      // Also set overflow hidden directly as backup
      document.body.style.overflow = 'hidden';
    } else {
      // Remove modal-open class from body to restore scrolling
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [show]);

  const isUnlocked = (achievementId) => unlockedAchievementIds.includes(achievementId);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-container achievement-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">🏆 成就殿堂</h2>
              <button className="modal-close-btn" onClick={onClose}>
                <IconX size={28} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="achievement-grid">
                {allAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`achievement-card ${isUnlocked(achievement.id) ? 'unlocked' : 'locked'}`}
                    title={isUnlocked(achievement.id) ? achievement.description : '未解锁'}
                  >
                    <div className="achievement-icon">
                      {isUnlocked(achievement.id) ? achievement.icon : '❓'}
                    </div>
                    <div className="achievement-name">
                      {isUnlocked(achievement.id) ? achievement.name : '神秘成就'}
                    </div>
                  </div>
                ))}
              </div>
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