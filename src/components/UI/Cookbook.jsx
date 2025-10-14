import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import allRecipes from '../../data/recipes.json';
import { IconX } from '@tabler/icons-react';

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: { delay: 0.2, type: "spring", stiffness: 120 }
  },
};

const Cookbook = ({ show, onClose, unlockedRecipeIds }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="cookbook-overlay"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div className="cookbook-modal" variants={modal}>
            <div className="modal-header">
              <h2 className="modal-title">我的食谱图鉴</h2>
              <button onClick={onClose} className="close-button">
                <IconX size={24} />
              </button>
            </div>
            <div className="cookbook-grid">
              {allRecipes.map(recipe => {
                const isUnlocked = unlockedRecipeIds.includes(recipe.id);
                return (
                  <div key={recipe.id} className={`cookbook-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <div className="cookbook-item-image">
                      <span role="img" aria-label={recipe.name}>{isUnlocked ? recipe.icon || '🍲' : '❓'}</span>
                    </div>
                    <h3 className="cookbook-item-name">{isUnlocked ? recipe.name : '未解锁'}</h3>
                    {isUnlocked && (
                      <p className="cookbook-item-ingredients">
                        +{recipe.bonusScore}分
                      </p>
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