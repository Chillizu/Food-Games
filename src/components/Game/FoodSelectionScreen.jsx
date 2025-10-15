import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FoodCard from '../Cards/FoodCard'
import { getFoods, getFoodCategories } from '../../utils/dataProcessing'
import HeaderActions from '../UI/HeaderActions'
import styles from './FoodSelectionScreen.module.css'

const FoodSelectionScreen = ({
  selectedFoods,
  onToggleFoodSelection,
  onDeselectFood,
  onStartCooking,
  canStartCooking,
  onOpenCookbook,
  onOpenAchievements,
  dailyChallenge
}) => {
  const [activeCategory, setActiveCategory] = useState('all')
  const foods = getFoods()
  const categories = getFoodCategories()

  const filteredFoods = activeCategory === 'all'
    ? foods
    : foods.filter(food => food.category === activeCategory)

  // 判断食材是否是挑战所需食材
  const isChallengeIngredient = (foodId) => {
    if (!dailyChallenge || !dailyChallenge.requiredIngredients) return false
    return dailyChallenge.requiredIngredients.some(ingredient => ingredient.id === foodId)
  }

  return (
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            选择你的实验食材
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            组合不同的食材，探索它们对环境和健康的影响。
          </motion.p>
        </div>
        <HeaderActions onCookbookClick={onOpenCookbook} onAchievementsClick={onOpenAchievements} />
      </div>

      {/* Category Filters */}
      <motion.div
        className={styles.filters}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          className={`${styles.chip} ${activeCategory === 'all' ? styles.active : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          全部
        </button>
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`${styles.chip} ${activeCategory === key ? styles.active : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            {category.name}
          </button>
        ))}
      </motion.div>

      {/* Food Grid */}
      <div className={styles.foodGrid}>
        <AnimatePresence>
          {filteredFoods.map((food) => (
            <motion.div
              key={food.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <FoodCard
                food={food}
                isSelected={selectedFoods.some(f => f.id === food.id)}
                onSelect={() => onToggleFoodSelection(food)}
                isChallengeIngredient={isChallengeIngredient(food.id)}
                dailyChallenge={dailyChallenge}
                selectedFoods={selectedFoods}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <motion.div
        className={styles.actionBar}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
      >
        <div className={styles.actionBarInfo}>
          已选 <strong>{selectedFoods.length}</strong> 种食材
        </div>
        <div className={styles.actionBarButtons}>
          {selectedFoods.length > 0 && (
            <motion.button
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={() => selectedFoods.forEach(food => onDeselectFood(food.id))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              清空
            </motion.button>
          )}
          <motion.button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={onStartCooking}
            disabled={!canStartCooking}
            whileHover={!canStartCooking ? {} : { scale: 1.05 }}
            whileTap={!canStartCooking ? {} : { scale: 0.95 }}
          >
            开始实验
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default FoodSelectionScreen