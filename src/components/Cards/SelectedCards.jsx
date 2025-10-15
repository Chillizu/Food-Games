import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getHighlightStyle } from '../../utils/styleUtils';

const SelectedCards = ({ selectedFoods, onDeselectFood, highlightedFoods, selectionStats }) => {
  return (
    <div className="hand-area__container">
      <div className="hand-area__header">
        <h2 className="hand-area__title">已选实验品</h2>
        <span className="hand-area__counter">{selectedFoods.length} / 9</span>
      </div>

      <div className="hand-area__cards-list">
        <AnimatePresence>
          {selectedFoods.length === 0 ? (
            <motion.div
              className="hand-area__empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="empty-state__icon">🧪</div>
              <p className="empty-state__text">从主区域选择食材</p>
              <p className="empty-state__subtext">它们会出现在这里</p>
            </motion.div>
          ) : (
            selectedFoods.map((food, index) => {
              const highlight = highlightedFoods[food.id];
              const style = highlight ? getHighlightStyle(highlight.colors) : {};

              return (
                <motion.div
                  key={food.id}
                  className="hand-card"
                  style={style}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="hand-card__emoji">{food.emoji}</div>
                  <div className="hand-card__details">
                    <h4 className="hand-card__name">{food.name}</h4>
                    <div className="hand-card__stats">
                      <span className="stat-item" title="碳排放">
                        🌍 {Math.round(food.carbonFootprint * 100)}
                      </span>
                      <span className="stat-item" title="水资源消耗">
                        💧 {Math.round(food.waterUsage * 100)}
                      </span>
                      <span className="stat-item" title="健康指数">
                        ❤️ {Math.round(food.healthScore * 100)}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    className="hand-card__remove-btn"
                    onClick={() => onDeselectFood(food.id)}
                    whileHover={{ scale: 1.1, backgroundColor: 'var(--danger-color)', color: '#fff' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {selectedFoods.length > 0 && selectionStats && (
        <motion.div
          className="selection-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="stats-title">当前选择总览</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon" title="总碳排放">🌍</span>
              <span className="stat-value">{Math.round(selectionStats.carbonFootprint * 100)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon" title="总水资源消耗">💧</span>
              <span className="stat-value">{Math.round(selectionStats.waterUsage * 100)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon" title="平均健康指数">❤️</span>
              <span className="stat-value">{Math.round(selectionStats.healthScore * 100)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SelectedCards