import React, { useState } from 'react'
import { motion } from 'framer-motion'
import FoodCard from '../Cards/FoodCard'
import { getFoods, getFoodCategories } from '../../utils/dataProcessing'
import { IconBook } from '@tabler/icons-react'

const FoodSelectionScreen = ({
  selectedFoods,
  onToggleFoodSelection,
  onDeselectFood,
  onStartCooking,
  canStartCooking,
  openCookbook
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
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            选择你的实验食材
          </motion.h1>
          <motion.button
            className="button-icon"
            onClick={openCookbook}
            title="打开食谱图鉴"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <IconBook size={32} />
          </motion.button>
        </div>
        <motion.p
          className="screen-subtitle"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          组合不同的食材，探索它们对环境和健康的影响。
        </motion.p>
      </div>

      {/* Category Filters */}
      <motion.div
        className="category-filters"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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
        {filteredFoods.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            isSelected={selectedFoods.some(f => f.id === food.id)}
            onSelect={() => onToggleFoodSelection(food)}
          />
        ))}
      </div>

      {/* Action Bar */}
      <motion.div
        className="action-bar"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
      >
        <div className="action-bar__info">
          已选 <strong>{selectedFoods.length}</strong> 种食材
        </div>
        <div className="action-bar__buttons">
          {selectedFoods.length > 0 && (
            <motion.button
              className="button button--secondary"
              onClick={() => selectedFoods.forEach(food => onDeselectFood(food.id))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              清空
            </motion.button>
          )}
          <motion.button
            className="button button--primary"
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