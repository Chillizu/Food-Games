import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecipes, getFoods } from '../../utils/dataProcessing';
import { IconX, IconLock, IconToolsKitchen2, IconLeaf } from '@tabler/icons-react';

const Cookbook = ({ show, onClose, unlockedRecipeIds }) => {
  const [activeTab, setActiveTab] = useState('recipes'); // 'recipes' or 'foods'
  const allRecipes = useMemo(() => getRecipes(), []);
  const allFoods = useMemo(() => getFoods().sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans')), []);

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
            className="modal-container cookbook-modal"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">📚 未来图鉴</h2>
              <button className="modal-close-btn" onClick={onClose}>
                <IconX size={28} />
              </button>
            </div>

            <div className="modal-tabs">
              <button 
                className={`modal-tab ${activeTab === 'recipes' ? 'active' : ''}`} 
                onClick={() => setActiveTab('recipes')}
              >
                <IconToolsKitchen2 size={20} /> 菜谱
              </button>
              <button 
                className={`modal-tab ${activeTab === 'foods' ? 'active' : ''}`} 
                onClick={() => setActiveTab('foods')}
              >
                <IconLeaf size={20} /> 食材
              </button>
            </div>
            
            <div className="modal-content">
              {activeTab === 'recipes' && (
                <div className="recipe-grid">
                  {allRecipes.map(recipe => {
                    const isUnlocked = unlockedRecipeIds.includes(recipe.id);
                    return (
                      <div 
                        key={recipe.id} 
                        className={`recipe-card ${isUnlocked ? 'unlocked' : 'locked'}`} 
                        title={isUnlocked ? recipe.description : '未解锁'}
                      >
                        {isUnlocked ? (
                          <>
                            <div className="recipe-icon">{recipe.emoji}</div>
                            <div className="recipe-name">{recipe.name}</div>
                          </>
                        ) : (
                          <>
                            <div className="recipe-icon"><IconLock size={40} /></div>
                            <div className="recipe-name">？？？</div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'foods' && (
                <div className="cookbook-food-grid">
                  {allFoods.map(food => (
                    <div key={food.id} className="cookbook-food-card" title={food.description}>
                      <div className="cookbook-food-emoji">{food.emoji}</div>
                      <h3 className="cookbook-food-name">{food.name}</h3>
                      <p className="cookbook-food-description">{food.description}</p>
                      <div className="cookbook-food-stats">
                        <div className="cookbook-food-stat" title={`碳排放: ${food.carbonFootprint}`}>
                          <span className="cookbook-food-stat-icon">🌱</span>
                          <span className="cookbook-food-stat-value">{Math.round(food.carbonFootprint * 100)}</span>
                          <span className="cookbook-food-stat-label">碳排</span>
                        </div>
                        <div className="cookbook-food-stat" title={`水消耗: ${food.waterUsage}`}>
                          <span className="cookbook-food-stat-icon">💧</span>
                          <span className="cookbook-food-stat-value">{Math.round(food.waterUsage * 100)}</span>
                          <span className="cookbook-food-stat-label">水耗</span>
                        </div>
                        <div className="cookbook-food-stat" title={`土地占用: ${food.landUsage}`}>
                          <span className="cookbook-food-stat-icon">🌍</span>
                          <span className="cookbook-food-stat-value">{Math.round(food.landUsage * 100)}</span>
                          <span className="cookbook-food-stat-label">土地</span>
                        </div>
                        <div className="cookbook-food-stat" title={`健康指数: ${food.healthScore}`}>
                          <span className="cookbook-food-stat-icon">❤️</span>
                          <span className="cookbook-food-stat-value">{Math.round(food.healthScore * 100)}</span>
                          <span className="cookbook-food-stat-label">健康</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

             <div className="modal-footer">
              {activeTab === 'recipes' 
                ? `已解锁: ${unlockedRecipeIds.length} / ${allRecipes.length}`
                : `共收录: ${allFoods.length} 种食材`
              }
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cookbook;