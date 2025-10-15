import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AchievementPopup = ({ achievement, onNext, isLast }) => {
  return (
    <AnimatePresence>
      <motion.div 
        className="achievement-popup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => isLast && onNext()}
      >
        <motion.div 
          className="achievement-popup"
          initial={{ scale: 0, rotateY: 90 }}
          animate={{ scale: 1, rotateY: 0 }}
          exit={{ scale: 0, rotateY: -90 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 成就图标动画 */}
          <motion.div 
            className="achievement-icon-container"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
          >
            <div className="achievement-icon">
              {achievement.icon}
            </div>
          </motion.div>

          {/* 成就信息 */}
          <div className="achievement-content">
            <motion.h2 
              className="achievement-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              🏆 成就解锁！
            </motion.h2>
            
            <motion.h3 
              className="achievement-name"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {achievement.name}
            </motion.h3>

            <motion.p 
              className="achievement-description"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {achievement.description}
            </motion.p>

            {/* 成就进度条 */}
          </div>

          {/* 继续按钮 */}
          <motion.button
            className="button button--primary achievement-continue-button"
            onClick={onNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {isLast ? '完成' : '下一个成就 →'}
          </motion.button>

          {/* 装饰性粒子效果 */}
          <div className="achievement-particles">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                style={{
                  color: achievement.color,
                }}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i * 45) * Math.PI / 180) * 60,
                  y: Math.sin((i * 45) * Math.PI / 180) * 60
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3 + i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AchievementPopup