import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconShare, IconHeart } from '@tabler/icons-react';
import styles from './CookbookDetail.module.css';

const CookbookDetail = ({ recipe, show, onClose, onShare }) => {
  if (!recipe) return null;

  // 获取稀有度对应的颜色
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case '传奇': return '#FFD700';
      case '稀有': return '#C0C0C0';
      case '常见': return '#CD7F32';
      default: return '#888888';
    }
  };

  // 获取难度对应的颜色
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '简单': return '#4CAF50';
      case '中等': return '#FF9800';
      case '困难': return '#F44336';
      default: return '#888888';
    }
  };

  return (
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className={styles.header}>
              <div className={styles.titleSection}>
                <div className={styles.emoji}>{recipe.emoji}</div>
                <div>
                  <h2 className={styles.title}>{recipe.name}</h2>
                  <div className={styles.meta}>
                    <span className={styles.tag} style={{ backgroundColor: getRarityColor(recipe.rarity) }}>
                      {recipe.rarity}
                    </span>
                    <span className={styles.tag} style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}>
                      {recipe.difficulty}
                    </span>
                    <span className={styles.tag}>{recipe.culture}</span>
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <button 
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare && onShare(recipe);
                  }}
                  title="分享食谱"
                >
                  <IconShare size={20} />
                </button>
                <button 
                  className={styles.closeButton}
                  onClick={onClose}
                  title="关闭"
                >
                  <IconX size={24} />
                </button>
              </div>
            </div>

            {/* 基本信息 */}
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>基本信息</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>烹饪时间</span>
                    <span className={styles.infoValue}>{recipe.cookingTime}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>份量</span>
                    <span className={styles.infoValue}>{recipe.servings}人份</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>基础分数</span>
                    <span className={styles.infoValue}>{recipe.bonusScore}分</span>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>食材清单</h3>
                <div className={styles.ingredients}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className={styles.ingredientItem}>
                      <span className={styles.ingredientDot} />
                      <span className={styles.ingredientName}>{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 描述 */}
            <div className={styles.descriptionSection}>
              <h3 className={styles.sectionTitle}>食谱描述</h3>
              <p className={styles.description}>{recipe.description}</p>
            </div>

            {/* 烹饪小贴士 */}
            <div className={styles.tipsSection}>
              <h3 className={styles.sectionTitle}>
                <IconHeart size={18} /> 烹饪小贴士
              </h3>
              <p className={styles.tips}>{recipe.tips}</p>
            </div>

            {/* SDG 贡献 */}
            <div className={styles.sdgSection}>
              <h3 className={styles.sectionTitle}>SDG 可持续发展目标贡献</h3>
              <div className={styles.sdgGrid}>
                {recipe.sdgs && recipe.sdgs.map((sdg, index) => (
                  <div key={index} className={styles.sdgCard}>
                    <div className={styles.sdgHeader}>
                      <span className={styles.sdgIcon}>🎯</span>
                      <div>
                        <h4 className={styles.sdgTitle}>{sdg.title}</h4>
                        <span className={styles.sdgPoints}>+{sdg.points}分</span>
                      </div>
                    </div>
                    <p className={styles.sdgContribution}>{sdg.contribution}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 底部操作 */}
            <div className={styles.footer}>
              <button 
                className={styles.primaryButton}
                onClick={() => {
                  // 这里可以添加收藏或标记为已做的功能
                  console.log('收藏/标记食谱:', recipe.id);
                }}
              >
                <IconHeart size={18} /> 收藏食谱
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookbookDetail;