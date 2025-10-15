import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecipes } from '../../utils/dataProcessing';
import { IconX, IconLock } from '@tabler/icons-react';
import CookbookDetail from './CookbookDetail';
import styles from './Cookbook.module.css';

const Cookbook = ({ show, onClose, unlockedRecipeIds }) => {
  const allRecipes = getRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedRecipe(null);
  };

  const handleShareRecipe = (recipe) => {
    // 这里可以实现分享功能
    console.log('分享食谱:', recipe.name);
    // 生成分享文本
    const shareText = `我在《未来食物实验室》中发现了"${recipe.name}"！这道${recipe.culture}风味的食谱为SDGs贡献了${recipe.sdgs.reduce((sum, sdg) => sum + sdg.points, 0)}分。快来一起探索可持续饮食的未来吧！`;
    
    // 使用 Web Share API 如果可用
    if (navigator.share) {
      navigator.share({
        title: '未来食物实验室 - 食谱分享',
        text: shareText,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // 回退到复制到剪贴板
      navigator.clipboard.writeText(shareText).then(() => {
        alert('分享文本已复制到剪贴板！');
      }).catch(err => {
        console.error('复制失败:', err);
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className={styles.modal}
              initial={{ y: "-100vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.header}>
                <h2 className={styles.title}>食谱图鉴</h2>
                <button className={styles.closeButton} onClick={onClose}><IconX size={28} /></button>
              </div>
              
              <div className={styles.grid}>
                {allRecipes.map(recipe => {
                  const isUnlocked = unlockedRecipeIds.includes(recipe.id);
                  return (
                    <motion.div
                      key={recipe.id}
                      className={`${styles.item} ${isUnlocked ? styles.unlocked : styles.locked}`}
                      whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                      whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                      onClick={() => isUnlocked && handleRecipeClick(recipe)}
                    >
                      {isUnlocked ? (
                        <>
                          <div className={styles.itemImage}>{recipe.emoji}</div>
                          <h3 className={styles.itemName}>{recipe.name}</h3>
                          <p className={styles.itemIngredients}>{recipe.ingredients.join(' + ')}</p>
                          <div className={styles.itemMeta}>
                            <span
                              className={styles.itemRarity}
                              style={{
                                backgroundColor:
                                  recipe.rarity === '传奇' ? '#FFD700' :
                                  recipe.rarity === '稀有' ? '#C0C0C0' : '#CD7F32'
                              }}
                            >
                              {recipe.rarity}
                            </span>
                            <span className={styles.itemScore}>+{recipe.bonusScore}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles.itemImage}><IconLock size={40} /></div>
                          <h3 className={styles.itemName}>？？？</h3>
                          <p className={styles.itemIngredients}>未解锁</p>
                          <div className={styles.itemMeta}>
                            <span className={`${styles.itemRarity} ${styles.locked}`}>锁定</span>
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 食谱详情弹窗 */}
      <CookbookDetail
        recipe={selectedRecipe}
        show={showDetail}
        onClose={handleCloseDetail}
        onShare={handleShareRecipe}
      />
    </>
  );
};

export default Cookbook;