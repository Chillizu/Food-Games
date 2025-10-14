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
          className="cookbook-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="cookbook-modal"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="modal-header">
              <h2 className="modal-title">食谱图鉴</h2>
              <button className="close-button" onClick={onClose}><IconX size={28} /></button>
            </div>
            
            <div className="cookbook-grid">
              {allRecipes.map(recipe => {
                const isUnlocked = unlockedRecipeIds.includes(recipe.id);
                return (
                  <div key={recipe.id} className={`cookbook-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    {isUnlocked ? (
                      <>
                        <div className="cookbook-item-image">{recipe.emoji}</div>
                        <h3 className="cookbook-item-name">{recipe.name}</h3>
                        <p className="cookbook-item-ingredients">{recipe.ingredients.join(' + ')}</p>
                      </>
                    ) : (
                      <>
                        <div className="cookbook-item-image"><IconLock size={40} /></div>
                        <h3 className="cookbook-item-name">？？？</h3>
                        <p className="cookbook-item-ingredients">未解锁</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cookbook;