import React from 'react'
import { motion } from 'framer-motion'

const SelectedCards = ({ selectedFoods, onDeselectFood }) => {
  return (
    <div className="selected-cards-container">
      {selectedFoods.length === 0 ? (
        <div className="empty-selection">
          <div className="empty-icon">🔬</div>
          <p>还没有选择食材</p>
          <p>从下方选择2-3种食材开始实验</p>
        </div>
      ) : (
        <div className="selected-cards">
          {selectedFoods.map((food, index) => (
            <motion.div
              key={food.id}
              className="selected-card"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
              style={{ backgroundColor: food.color + '10' }}
            >
              <div className="selected-card-content">
                <div className="selected-food-info">
                  <div className="selected-food-emoji">
                    {food.emoji}
                  </div>
                  <div className="selected-food-details">
                    <h4 className="selected-food-name">{food.name}</h4>
                    <div className="selected-food-stats">
                      <span className="stat-item">
                        🌍 {Math.round(food.carbonFootprint * 100)}%
                      </span>
                      <span className="stat-item">
                        💧 {Math.round(food.waterUsage * 100)}%
                      </span>
                      <span className="stat-item">
                        ❤️ {Math.round(food.healthScore * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  className="deselect-button"
                  onClick={() => onDeselectFood(food.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 选择计数器 */}
      {selectedFoods.length > 0 && (
        <div className="selection-counter">
          <div className="counter-progress">
            <div
              className="counter-fill"
              style={{
                width: `${(selectedFoods.length / 9) * 100}%`,
                backgroundColor: selectedFoods[0]?.color || '#22c55e'
              }}
            />
          </div>
          <span className="counter-text">
            {selectedFoods.length} / 9 已选择
          </span>
        </div>
      )}
    </div>
  )
}

export default SelectedCards