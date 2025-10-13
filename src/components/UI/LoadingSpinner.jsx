import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <motion.div
          className="spinner-ring"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          <div className="spinner-circle"></div>
        </motion.div>
        <motion.div
          className="spinner-inner"
          animate={{ rotate: -360 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          <div className="spinner-dot"></div>
        </motion.div>
      </div>
      <motion.div
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        🧪 正在加载未来食物实验室...
      </motion.div>
    </div>
  )
}

export default LoadingSpinner