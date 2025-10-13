import React, { useState, useEffect, useRef, useCallback } from 'react'

// 性能监控组件
export const PerformanceMonitor = ({ children }) => {
  const [fps, setFps] = useState(0)
  const [memory, setMemory] = useState(0)
  const [renderTime, setRenderTime] = useState(0)
  const [isOptimized, setIsOptimized] = useState(true)
  
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const lastFpsUpdate = useRef(performance.now())
  
  // FPS计算
  useEffect(() => {
    let animationId
    
    const calculateFPS = (currentTime) => {
      frameCount.current++
      
      // 每秒更新一次FPS
      if (currentTime - lastFpsUpdate.current >= 1000) {
        const delta = currentTime - lastFpsUpdate.current
        const currentFps = Math.round((frameCount.current * 1000) / delta)
        setFps(currentFps)
        
        // 性能评估
        if (currentFps < 30) {
          setIsOptimized(false)
        } else if (currentFps >= 50) {
          setIsOptimized(true)
        }
        
        frameCount.current = 0
        lastFpsUpdate.current = currentTime
      }
      
      animationId = requestAnimationFrame(calculateFPS)
    }
    
    animationId = requestAnimationFrame(calculateFPS)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])
  
  // 内存监控
  useEffect(() => {
    if (performance.memory) {
      const updateMemory = () => {
        const used = Math.round(performance.memory.usedJSHeapSize / 1048576)
        setMemory(used)
        
        if (used > 500) { // 超过500MB警告
          setIsOptimized(false)
        }
        
        setTimeout(updateMemory, 5000)
      }
      
      updateMemory()
    }
  }, [])
  
  // 渲染时间监控
  const measureRenderTime = useCallback((callback) => {
    const start = performance.now()
    callback()
    const end = performance.now()
    const time = end - start
    setRenderTime(time)
    
    if (time > 16) { // 超过16ms警告
      setIsOptimized(false)
    }
  }, [])
  
  return (
    <PerformanceContext.Provider value={{
      fps,
      memory,
      renderTime,
      isOptimized,
      measureRenderTime
    }}>
      {children}
    </PerformanceContext.Provider>
  )
}

// 性能上下文
const PerformanceContext = React.createContext()

// 性能优化钩子
export const usePerformance = () => {
  const context = React.useContext(PerformanceContext)
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceMonitor')
  }
  return context
}

// 优化的3D场景组件
export const OptimizedScene = ({ children, ...props }) => {
  const { measureRenderTime } = usePerformance()
  const sceneRef = useRef(null)
  
  return (
    <div 
      ref={sceneRef}
      {...props}
      children={measureRenderTime(() => children)}
    />
  )
}

// 虚拟化长列表组件
export const VirtualizedList = ({ 
  items, 
  height, 
  itemHeight, 
  renderItem,
  className = '' 
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)
  
  const visibleItems = items.filter((_, index) => {
    const itemTop = index * itemHeight
    const itemBottom = itemTop + itemHeight
    const containerTop = scrollTop
    const containerBottom = containerTop + height
    
    return itemBottom >= containerTop && itemTop <= containerBottom
  })
  
  const startIndex = Math.floor(scrollTop / itemHeight)
  const totalHeight = items.length * itemHeight
  
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop)
  }
  
  return (
    <div 
      ref={containerRef}
      className={`virtualized-list ${className}`}
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index
          return (
            <div
              key={actualIndex}
              style={{ 
                position: 'absolute',
                top: actualIndex * itemHeight,
                width: '100%',
                height: itemHeight
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 懒加载组件
export const LazyLoad = ({ 
  children, 
  placeholder,
  threshold = 0.1,
  rootMargin = '50px' 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin
      }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, rootMargin])
  
  return (
    <div ref={ref}>
      {isVisible ? children : placeholder}
    </div>
  )
}

// 防抖组件
export const Debounce = ({ 
  delay, 
  children, 
  onChange,
  value 
}) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
      onChange(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, onChange])
  
  return children(debouncedValue)
}

// 节流组件
export const Throttle = ({ 
  delay, 
  children, 
  onChange,
  value 
}) => {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastExec = useRef(0)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now()
      if (now - lastExec.current >= delay) {
        setThrottledValue(value)
        onChange(value)
        lastExec.current = now
      }
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, onChange])
  
  return children(throttledValue)
}

// 内存优化组件
export const MemoryOptimizer = ({ children }) => {
  const [isLowMemory, setIsLowMemory] = useState(false)
  
  useEffect(() => {
    const checkMemory = () => {
      if (performance.memory) {
        const used = performance.memory.usedJSHeapSize
        const total = performance.memory.totalJSHeapSize
        const limit = performance.memory.jsHeapSizeLimit
        
        const usageRatio = used / limit
        
        if (usageRatio > 0.8) {
          setIsLowMemory(true)
          // 清理不必要的缓存
          cleanupMemory()
        } else {
          setIsLowMemory(false)
        }
      }
    }
    
    const cleanupMemory = () => {
      // 清理缓存
      if (window.caches) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name))
        })
      }
      
      // 清理大型对象
      if (window.largeDataCache) {
        window.largeDataCache.clear()
      }
    }
    
    const interval = setInterval(checkMemory, 5000)
    checkMemory()
    
    return () => clearInterval(interval)
  }, [])
  
  if (isLowMemory) {
    return (
      <div className="memory-warning">
        ⚠️ 系统内存不足，正在优化性能...
      </div>
    )
  }
  
  return children
}

// GPU加速组件
export const GPUAccelerator = ({ children, className = '' }) => {
  return (
    <div 
      className={`gpu-accelerator ${className}`}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  )
}

// 预加载组件
export const Preloader = ({ resources, onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    let loadedCount = 0
    const total = resources.length
    
    const loadResource = (resource) => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        setProgress(Math.round((loadedCount / total) * 100))
        
        if (loadedCount === total) {
          setLoaded(true)
          onComplete && onComplete()
        }
      }
      img.onerror = () => {
        loadedCount++
        setProgress(Math.round((loadedCount / total) * 100))
        
        if (loadedCount === total) {
          setLoaded(true)
          onComplete && onComplete()
        }
      }
      img.src = resource
    }
    
    resources.forEach(loadResource)
  }, [resources, onComplete])
  
  if (!loaded) {
    return (
      <div className="preloader">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-text">加载中... {progress}%</div>
      </div>
    )
  }
  
  return null
}

// 性能统计组件
export const PerformanceStats = () => {
  const { fps, memory, renderTime, isOptimized } = usePerformance()
  
  return (
    <div className={`performance-stats ${isOptimized ? 'optimized' : 'warning'}`}>
      <div className="stat-item">
        <span className="stat-label">FPS:</span>
        <span className={`stat-value ${fps < 30 ? 'warning' : ''}`}>
          {fps}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">内存:</span>
        <span className={`stat-value ${memory > 500 ? 'warning' : ''}`}>
          {memory}MB
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">渲染:</span>
        <span className={`stat-value ${renderTime > 16 ? 'warning' : ''}`}>
          {renderTime.toFixed(1)}ms
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">状态:</span>
        <span className={`stat-value ${isOptimized ? 'good' : 'bad'}`}>
          {isOptimized ? '良好' : '优化中'}
        </span>
      </div>
    </div>
  )
}

export default PerformanceMonitor