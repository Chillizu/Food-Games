import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecipes, getFoods } from '../../utils/dataProcessing';
import { IconX, IconLock, IconToolsKitchen2, IconLeaf } from '@tabler/icons-react';

const Cookbook = ({ show, onClose, unlockedRecipeIds }) => {
  const [activeTab, setActiveTab] = useState('recipes'); // 'recipes' or 'foods'
  const allRecipes = useMemo(() => getRecipes(), []);
  const allFoods = useMemo(() => getFoods().sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans')), []);

  const StatItem = ({ label, value }) => (
    <li className="food-dex-stat-item">
      <span>{label}</span>
      <span className="food-dex-stat-value">{value.toFixed(2)}</span>
    </li>
  );

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
            className="achievement-gallery-modal cookbook-modal"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">📚 未来图鉴</h2>
              <button className="close-button" onClick={onClose}><IconX size={28} /></button>
            </div>

            <div className="modal-tabs">
              <button className={`modal-tab ${activeTab === 'recipes' ? 'active' : ''}`} onClick={() => setActiveTab('recipes')}>
                <IconToolsKitchen2 size={20} /> 菜谱
              </button>
              <button className={`modal-tab ${activeTab === 'foods' ? 'active' : ''}`} onClick={() => setActiveTab('foods')}>
                <IconLeaf size={20} /> 食材
              </button>
            </div>
            
            <div className="modal-content">
              {activeTab === 'recipes' && (
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
              )}

              {activeTab === 'foods' && (
                <div className="food-dex-list">
                  {allFoods.map(food => (
                    <div key={food.id} className="food-dex-item">
                      <div className="food-dex-info">
                        <span className="food-dex-emoji">{food.emoji}</span>
                        <h3 className="food-dex-name">{food.name}</h3>
                        <p className="food-dex-description">{food.description}</p>
                      </div>
                      <ul className="food-dex-stats">
                        <StatItem label="碳排放" value={food.carbonFootprint} />
                        <StatItem label="水消耗" value={food.waterUsage} />
                        <StatItem label="土地用" value={food.landUsage} />
                        <StatItem label="健康分" value={food.healthScore} />
                      </ul>
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