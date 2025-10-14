import React from 'react'
import { motion } from 'framer-motion'
import FoodCard from '../Cards/FoodCard'
import SelectedCards from '../Cards/SelectedCards'
import { getFoods, getFoodCategories } from '../../utils/dataProcessing'

const FoodSelectionScreen = ({ 
  selectedFoods, 
  onSelectFood, 
  onDeselectFood, 
  onStartCooking, 
  canStartCooking 
}) => {
  const foods = getFoods()
  const categories = getFoodCategories()

  return (
  <div className="food-selection-screen">
    <div className="selection-content-wrapper">
      {/* 标题和进度 */}
      <div className="selection-header">
        <div className="header-card">
          <motion.h1
            className="selection-title"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            🎯 选择食材
          </motion.h1>
          <p className="selection-instruction">
            选择食材制作多道环保料理（每道菜2-3种食材，最多选择9种）
          </p>
        </div>
        
        {/* 进度指示器 */}
        <div className="progress-card">
          <div className="progress-indicator">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(selectedFoods.length / 9) * 100}%` }}
              />
            </div>
            <span className="progress-text">
              {selectedFoods.length} / 9 种食材
            </span>
          </div>
        </div>
      </div>

      <div className="selection-content">
        {/* 已选食材区域 */}
        <motion.div
          className="selected-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="section-card">
            <h3>🔬 已选食材</h3>
            <SelectedCards
              selectedFoods={selectedFoods}
              onDeselectFood={onDeselectFood}
            />
          </div>
        </motion.div>

        {/* 食材分类标签 */}
        <motion.div
          className="category-tabs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="tabs-card">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                className="category-tab"
                style={{
                  backgroundColor: category.color + '20',
                  borderColor: category.color
                }}
              >
                <span className="category-color" style={{ backgroundColor: category.color }} />
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 食材卡牌网格平铺区域 */}
        <motion.div
          className="food-grid-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="food-grid-track">
            {foods.map((food, index) => (
              <motion.div
                key={food.id}
                className="food-card-grid"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FoodCard
                  food={food}
                  isSelected={selectedFoods.some(f => f.id === food.id)}
                  onSelect={() => onSelectFood(food)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          className="action-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="buttons-card">
            <motion.button
              className={`cartoon-button cook-button ${!canStartCooking ? 'disabled' : ''}`}
              onClick={onStartCooking}
              disabled={!canStartCooking}
              whileHover={!canStartCooking ? {} : { scale: 1.05 }}
              whileTap={!canStartCooking ? {} : { scale: 0.95 }}
            >
              🍳 开始烹饪 ({Math.floor(selectedFoods.length / 2)}道菜)
            </motion.button>
            
            {selectedFoods.length > 0 && (
              <motion.button
                className="cartoon-button clear-button"
                onClick={() => selectedFoods.forEach(food => onDeselectFood(food.id))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🗑️ 清空选择
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* 食谱建议 */}
        <motion.div
          className="recipe-suggestions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="suggestions-card">
            <h3>💡 食谱建议</h3>
            <div className="suggestions-grid">
              <div className="suggestion-item">
                <span className="suggestion-icon">🥗</span>
                <span>沙拉类：蔬菜 + 水果</span>
              </div>
              <div className="suggestion-item">
                <span className="suggestion-icon">🍲</span>
                <span>热菜类：蛋白质 + 蔬菜</span>
              </div>
              <div className="suggestion-item">
                <span className="suggestion-icon">🍜</span>
                <span>主食类：谷物 + 蛋白质</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 环保提示 */}
        <motion.div
          className="eco-tips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="tips-card">
            <h4>💡 环保小贴士</h4>
            <ul>
              <li>🌱 植物性食物通常更环保</li>
              <li>🪲 昆虫蛋白是未来的优质选择</li>
              <li>🧪 实验室培育食物环境影响小</li>
              <li>⚖️ 均衡搭配营养更全面</li>
            </ul>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  )
}

export default FoodSelectionScreen