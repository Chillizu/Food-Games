import React from 'react'
import { motion } from 'framer-motion'
import { IconLeaf, IconDroplet, IconWorld, IconHeart, IconStar, IconSparkles } from '@tabler/icons-react'
import foodReactionsData from '../../data/foodReactions.json'
import styles from './FoodCard.module.css'

const FoodCard = ({ food, isSelected, onSelect, isChallengeIngredient, dailyChallenge, selectedFoods = [] }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { y: -6, scale: 1.03 },
    tap: { scale: 0.97 }
  }

  // 获取 SDG 颜色
  const getSdgColor = () => {
    if (!dailyChallenge) return 'var(--color-primary)'
    
    switch (dailyChallenge.sdg) {
      case 'SDG 2':
        return '#f59e0b' // 黄色 - 零饥饿
      case 'SDG 12':
        return '#10b981' // 绿色 - 负责任消费
      case 'SDG 13':
        return '#3b82f6' // 蓝色 - 气候行动
      default:
        return 'var(--color-primary)'
    }
  }

  // 检测食材可以参与的组合
  const detectPossibleReactions = () => {
    const possibleReactions = [];
    const selectedFoodIds = selectedFoods.map(f => f.id);
    
    foodReactionsData.reactions.forEach(reaction => {
      const requiredIngredientIds = reaction.requiredIngredients.map(ing => ing.id);
      const hasCurrentIngredient = requiredIngredientIds.includes(food.id);
      
      if (hasCurrentIngredient) {
        // 检查还需要哪些食材
        const missingIngredients = requiredIngredientIds.filter(id => !selectedFoodIds.includes(id) && id !== food.id);
        
        // 如果还需要其他食材，显示提示
        if (missingIngredients.length > 0) {
          possibleReactions.push({
            id: reaction.id,
            name: reaction.name,
            missingCount: missingIngredients.length,
            sdgSynergy: reaction.sdgSynergy,
            visualEffect: reaction.visualEffect
          });
        }
      }
    });
    
    return possibleReactions;
  }

  // 获取组合提示颜色
  const getReactionColor = (visualEffect) => {
    const effect = foodReactionsData.visualEffects[visualEffect];
    return effect ? effect.color : '#8b5cf6';
  }

  const possibleReactions = detectPossibleReactions();

  const cardClasses = `${styles.card} ${isSelected ? styles.selected : ''} ${isChallengeIngredient ? styles.challengeIngredient : ''} ${possibleReactions.length > 0 ? styles.reactionHint : ''}`

  return (
    <motion.div
      className={cardClasses}
      onClick={onSelect}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      layout
    >
      <div className={styles.emojiBackground}>{food.emoji}</div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.emoji}>{food.emoji}</div>
          <h3 className={styles.name}>{food.name}</h3>
          {isChallengeIngredient && dailyChallenge && (
            <div
              className={styles.challengeBadge}
              style={{ borderColor: getSdgColor() }}
              title={`挑战所需: ${dailyChallenge.sdgTitle}`}
            >
              <IconStar size={14} style={{ color: getSdgColor() }} />
            </div>
          )}
          {possibleReactions.length > 0 && (
            <div
              className={styles.reactionBadge}
              title={`可参与 ${possibleReactions.length} 个 SDG 组合`}
            >
              <IconSparkles size={14} />
            </div>
          )}
        </div>
        <p className={styles.description}>{food.description}</p>
        <div className={styles.footer}>
          <div className={styles.stats}>
            <div className={styles.statItem} title={`碳排放 (越低越好): ${food.carbonFootprint}`}>
              <IconLeaf size={16} />
              <span>{Math.round(food.carbonFootprint * 100)}</span>
            </div>
            <div className={styles.statItem} title={`水消耗 (越低越好): ${food.waterUsage}`}>
              <IconDroplet size={16} />
              <span>{Math.round(food.waterUsage * 100)}</span>
            </div>
            <div className={styles.statItem} title={`健康指数 (越高越好): ${food.healthScore}`}>
              <IconHeart size={16} />
              <span>{Math.round(food.healthScore * 100)}</span>
            </div>
          </div>
          
          {possibleReactions.length > 0 && (
            <div className={styles.reactionHint}>
              <div className={styles.reactionTooltip}>
                {possibleReactions.slice(0, 2).map(reaction => (
                  <div key={reaction.id} className={styles.reactionItem}>
                    <IconSparkles size={12} />
                    <span>{reaction.name}</span>
                  </div>
                ))}
                {possibleReactions.length > 2 && (
                  <div className={styles.moreReactions}>
                    +{possibleReactions.length - 2} 更多
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className={`${styles.selectIndicator} ${isSelected ? styles.visible : ''}`}>
            ✓
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FoodCard