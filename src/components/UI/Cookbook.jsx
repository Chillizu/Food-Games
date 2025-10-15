import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecipes } from '../../utils/dataProcessing';
import { IconX, IconLock } from '@tabler/icons-react';

const Cookbook = ({ show, onClose, unlockedRecipeIds }) => {
  const allRecipes = getRecipes();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="achievement-gallery-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="achievement-gallery-modal"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">📚 食谱图鉴</h2>
              <button className="close-button" onClick={onClose}><IconX size={28} /></button>
            </div>
            
            <div className="achievement-gallery-grid">
              {allRecipes.map(recipe => {
                const isUnlocked = unlockedRecipeIds.includes(recipe.id);
                return (
                  <div key={recipe.id} className={`achievement-gallery-item ${isUnlocked ? 'unlocked' : 'locked'}`} title={isUnlocked ? recipe.description : '未解锁'}>
                    {isUnlocked ? (
                      <>
                        <div className="achievement-gallery-icon">{recipe.emoji}</div>
                        <div className="achievement-gallery-name">{recipe.name}</div>
                      </>
                    ) : (
                      <>
                        <div className="achievement-gallery-icon"><IconLock size={40} /></div>
                        <div className="achievement-gallery-name">？？？</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
             <div className="modal-footer">
              已解锁: {unlockedRecipeIds.length} / {allRecipes.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cookbook;