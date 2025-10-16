import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FoodCard from '../Cards/FoodCard'
import { getFoods, getFoodCategories } from '../../utils/dataProcessing'
import ModernProgressBar from '../UI/ModernProgressBar'

const FoodSelectionScreen = ({
  selectedFoods,
  onToggleFoodSelection,
  onDeselectFood,
  onStartCooking,
  canStartCooking,
  selectionStats
}) => {
  const [activeCategory, setActiveCategory] = useState('all')
  const foods = getFoods()
  const categories = getFoodCategories()

  const filteredFoods = activeCategory === 'all'
    ? foods
    : foods.filter(food => food.category === activeCategory)

  return (
    <div className="food-selection-screen">
      {/* Header */}
      <div className="screen-header">
        <div className="title-with-button">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              选择你的实验食材
            </motion.h1>
            <motion.p
              className="screen-subtitle"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05, ease: 'easeOut' }}
            >
              组合不同的食材，探索它们对环境和健康的影响。
            </motion.p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <motion.div
        className="category-filters"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
      >
        <button
          className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          全部
        </button>
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`category-chip ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            {category.name}
          </button>
        ))}
      </motion.div>

      {/* Food Grid */}
      <div className="food-grid">
        <AnimatePresence>
          {filteredFoods.map((food) => (
            <motion.div
              key={food.id}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <FoodCard
                food={food}
                isSelected={selectedFoods.some(f => f.id === food.id)}
                onSelect={() => onToggleFoodSelection(food)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <motion.div
        className="action-bar"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="action-bar__stats">
          {selectionStats && selectedFoods.length > 0 ? (
            <>
              <ModernProgressBar label="碳" value={selectionStats.carbonFootprint} max={2.5} compact />
              <ModernProgressBar label="水" value={selectionStats.waterUsage} max={2.5} compact />
              <ModernProgressBar label="健康" value={selectionStats.healthScore} max={1} compact />
            </>
          ) : (
            <div className="action-bar__info">
              已选 <strong>{selectedFoods.length}</strong> 种食材
            </div>
          )}
        </div>
        <div className="action-bar__buttons">
          <button
            className="button button--primary"
            onClick={onStartCooking}
            disabled={!canStartCooking}
          >
            开始实验
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default FoodSelectionScreen