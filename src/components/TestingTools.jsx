import React, { useState, useEffect, useRef } from 'react'

// 调试面板组件
export const DebugPanel = ({ 
  isVisible = false, 
  onClose,
  gameData 
}) => {
  const [logs, setLogs] = useState([])
  const [fps, setFps] = useState(0)
  const [memory, setMemory] = useState(0)
  const [errors, setErrors] = useState([])
  
  const logContainerRef = useRef(null)
  
  // FPS监控
  useEffect(() => {
    if (!isVisible) return
    
    let frameCount = 0
    let lastTime = performance.now()
    
    const calculateFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }
      
      if (isVisible) {
        requestAnimationFrame(calculateFPS)
      }
    }
    
    calculateFPS()
    
    return () => {
      // 清理
    }
  }, [isVisible])
  
  // 内存监控
  useEffect(() => {
    if (!isVisible) return
    
    const updateMemory = () => {
      if (performance.memory) {
        setMemory(Math.round(performance.memory.usedJSHeapSize / 1048576))
      }
      
      if (isVisible) {
        setTimeout(updateMemory, 5000)
      }
    }
    
    updateMemory()
  }, [isVisible])
  
  // 日志滚动
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])
  
  // 添加日志
  const addLog = (level, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString()
    const newLog = {
      timestamp,
      level,
      message,
      data
    }
    
    setLogs(prev => [...prev.slice(-99), newLog]) // 保持最近100条日志
    
    // 错误日志特殊处理
    if (level === 'error') {
      setErrors(prev => [...prev, newLog])
    }
  }
  
  // 清空日志
  const clearLogs = () => {
    setLogs([])
    setErrors([])
  }
  
  // 导出日志
  const exportLogs = () => {
    const logData = {
      timestamp: new Date().toISOString(),
      fps,
      memory,
      logs,
      errors,
      gameData
    }
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debug-logs-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  if (!isVisible) return null
  
  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>🔧 调试面板</h3>
        <button className="debug-close" onClick={onClose}>✕</button>
      </div>
      
      <div className="debug-stats">
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
          <span className="stat-label">日志:</span>
          <span className="stat-value">{logs.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">错误:</span>
          <span className={`stat-value ${errors.length > 0 ? 'error' : ''}`}>
            {errors.length}
          </span>
        </div>
      </div>
      
      <div className="debug-controls">
        <button onClick={clearLogs} className="debug-button">清空日志</button>
        <button onClick={exportLogs} className="debug-button">导出日志</button>
        <button onClick={() => addLog('info', '测试日志')} className="debug-button">测试日志</button>
      </div>
      
      <div className="debug-logs" ref={logContainerRef}>
        {logs.map((log, index) => (
          <div key={index} className={`log-entry ${log.level}`}>
            <span className="log-time">{log.timestamp}</span>
            <span className={`log-level ${log.level}`}>{log.level.toUpperCase()}</span>
            <span className="log-message">{log.message}</span>
            {log.data && (
              <pre className="log-data">{JSON.stringify(log.data, null, 2)}</pre>
            )}
          </div>
        ))}
        
        {logs.length === 0 && (
          <div className="log-empty">暂无日志</div>
        )}
      </div>
    </div>
  )
}

// 性能测试组件
export const PerformanceTester = ({ onTestComplete }) => {
  const [isTesting, setIsTesting] = useState(false)
  const [results, setResults] = useState(null)
  
  const runPerformanceTest = async () => {
    setIsTesting(true)
    const testResults = {
      fps: [],
      memory: [],
      renderTime: [],
      timestamp: Date.now()
    }
    
    // FPS测试
    const fpsTest = () => {
      return new Promise(resolve => {
        let frameCount = 0
        const startTime = performance.now()
        const duration = 5000 // 5秒
        
        const countFrames = () => {
          frameCount++
          if (performance.now() - startTime < duration) {
            requestAnimationFrame(countFrames)
          } else {
            const fps = Math.round((frameCount * 1000) / duration)
            testResults.fps.push(fps)
            resolve()
          }
        }
        
        countFrames()
      })
    }
    
    // 内存测试
    const memoryTest = () => {
      return new Promise(resolve => {
        const initialMemory = performance.memory?.usedJSHeapSize || 0
        const objects = []
        
        // 创建大量对象
        for (let i = 0; i < 10000; i++) {
          objects.push({
            id: i,
            data: new Array(100).fill(Math.random())
          })
        }
        
        // 测量内存使用
        setTimeout(() => {
          const peakMemory = performance.memory?.usedJSHeapSize || 0
          testResults.memory.push({
            initial: Math.round(initialMemory / 1048576),
            peak: Math.round(peakMemory / 1048576),
            increase: Math.round((peakMemory - initialMemory) / 1048576)
          })
          
          // 清理对象
          objects.length = 0
          
          setTimeout(resolve, 1000) // 等待垃圾回收
        }, 100)
      })
    }
    
    // 渲染时间测试
    const renderTimeTest = () => {
      return new Promise(resolve => {
        const times = []
        const iterations = 100
        
        const testRender = () => {
          const start = performance.now()
          
          // 模拟渲染操作
          for (let i = 0; i < 1000; i++) {
            Math.sqrt(i) * Math.sin(i)
          }
          
          const end = performance.now()
          times.push(end - start)
          
          if (times.length < iterations) {
            requestAnimationFrame(testRender)
          } else {
            const avgTime = times.reduce((a, b) => a + b, 0) / times.length
            testResults.renderTime.push({
              average: avgTime.toFixed(2),
              min: Math.min(...times).toFixed(2),
              max: Math.max(...times).toFixed(2)
            })
            resolve()
          }
        }
        
        testRender()
      })
    }
    
    try {
      await Promise.all([fpsTest(), memoryTest(), renderTimeTest()])
      
      // 计算综合评分
      const avgFps = testResults.fps.reduce((a, b) => a + b, 0) / testResults.fps.length
      const memoryIncrease = testResults.memory[0]?.increase || 0
      const avgRenderTime = testResults.renderTime[0]?.average || 0
      
      let performanceScore = 100
      if (avgFps < 30) performanceScore -= 30
      else if (avgFps < 50) performanceScore -= 15
      
      if (memoryIncrease > 100) performanceScore -= 20
      else if (memoryIncrease > 50) performanceScore -= 10
      
      if (avgRenderTime > 16) performanceScore -= 15
      else if (avgRenderTime > 8) performanceScore -= 5
      
      performanceScore = Math.max(0, performanceScore)
      
      setResults({
        ...testResults,
        score: performanceScore,
        grade: performanceScore >= 80 ? '优秀' : 
               performanceScore >= 60 ? '良好' : 
               performanceScore >= 40 ? '一般' : '较差'
      })
      
      onTestComplete && onTestComplete(results)
    } catch (error) {
      console.error('性能测试失败:', error)
    } finally {
      setIsTesting(false)
    }
  }
  
  return (
    <div className="performance-tester">
      <h3>🚀 性能测试</h3>
      <p>运行此测试将评估游戏的性能表现</p>
      
      <button 
        onClick={runPerformanceTest} 
        disabled={isTesting}
        className="test-button"
      >
        {isTesting ? '测试中...' : '开始测试'}
      </button>
      
      {results && (
        <div className="test-results">
          <h4>测试结果</h4>
          <div className="result-item">
            <span>性能评分:</span>
            <span className={`score ${results.score >= 80 ? 'excellent' : 
                                     results.score >= 60 ? 'good' : 
                                     results.score >= 40 ? 'fair' : 'poor'}`}>
              {results.score}/100 ({results.grade})
            </span>
          </div>
          <div className="result-item">
            <span>平均FPS:</span>
            <span>{(results.fps.reduce((a, b) => a + b, 0) / results.fps.length).toFixed(1)}</span>
          </div>
          <div className="result-item">
            <span>内存增长:</span>
            <span>{results.memory[0]?.increase || 0}MB</span>
          </div>
          <div className="result-item">
            <span>平均渲染时间:</span>
            <span>{results.renderTime[0]?.average || 0}ms</span>
          </div>
        </div>
      )}
    </div>
  )
}

// 用户体验测试组件
export const UXTester = ({ onFeedbackSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState({})
  const [feedback, setFeedback] = useState('')
  
  const testQuestions = [
    {
      id: 'ease_of_use',
      question: '游戏操作是否容易上手？',
      type: 'rating',
      scale: [1, 2, 3, 4, 5],
      labels: ['非常困难', '比较困难', '一般', '比较容易', '非常容易']
    },
    {
      id: 'visual_appeal',
      question: '游戏的视觉效果如何？',
      type: 'rating',
      scale: [1, 2, 3, 4, 5],
      labels: ['很差', '较差', '一般', '良好', '优秀']
    },
    {
      id: 'performance',
      question: '游戏运行是否流畅？',
      type: 'rating',
      scale: [1, 2, 3, 4, 5],
      labels: ['卡顿严重', '偶尔卡顿', '基本流畅', '比较流畅', '非常流畅']
    },
    {
      id: 'enjoyment',
      question: '你是否享受游戏过程？',
      type: 'rating',
      scale: [1, 2, 3, 4, 5],
      labels: ['完全不享受', '不太享受', '一般', '比较享受', '非常享受']
    },
    {
      id: 'suggestions',
      question: '你有什么建议或意见吗？',
      type: 'text',
      placeholder: '请输入你的建议...'
    }
  ]
  
  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }
  
  const handleNext = () => {
    if (currentStep < testQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSubmit = () => {
    const testData = {
      timestamp: Date.now(),
      responses,
      feedback
    }
    
    onFeedbackSubmit && onFeedbackSubmit(testData)
    
    // 重置测试
    setCurrentStep(0)
    setResponses({})
    setFeedback('')
  }
  
  const currentQuestion = testQuestions[currentStep]
  
  return (
    <div className="ux-tester">
      <h3>🎮 用户体验测试</h3>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentStep + 1) / testQuestions.length) * 100}%` }}
        />
      </div>
      
      <div className="question-container">
        <h4>{currentQuestion.question}</h4>
        
        {currentQuestion.type === 'rating' && (
          <div className="rating-scale">
            {currentQuestion.scale.map((value, index) => (
              <button
                key={value}
                className={`rating-button ${responses[currentQuestion.id] === value ? 'selected' : ''}`}
                onClick={() => handleResponse(currentQuestion.id, value)}
              >
                <span className="rating-value">{value}</span>
                <span className="rating-label">{currentQuestion.labels[index]}</span>
              </button>
            ))}
          </div>
        )}
        
        {currentQuestion.type === 'text' && (
          <textarea
            className="feedback-text"
            placeholder={currentQuestion.placeholder}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
        )}
      </div>
      
      <div className="test-navigation">
        <button 
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="nav-button"
        >
          上一题
        </button>
        
        <button 
          onClick={handleNext}
          className="nav-button primary"
        >
          {currentStep === testQuestions.length - 1 ? '提交' : '下一题'}
        </button>
      </div>
    </div>
  )
}

// 错误边界组件
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
    
    // 记录错误
    console.error('游戏错误:', error, errorInfo)
    
    // 可以在这里发送错误报告到服务器
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>🚨 游戏出现错误</h2>
          <p>很抱歉，游戏遇到了一些问题。</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>错误详情</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button onClick={() => this.setState({ hasError: false })}>
            重试
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}

// 自动保存组件
export const AutoSave = ({ data, onSave, interval = 30000 }) => {
  const [lastSaved, setLastSaved] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle')
  
  useEffect(() => {
    const saveData = () => {
      setSaveStatus('saving')
      
      try {
        const serializedData = JSON.stringify(data)
        localStorage.setItem('gameAutoSave', serializedData)
        setLastSaved(new Date())
        setSaveStatus('saved')
        
        if (onSave) {
          onSave(data)
        }
      } catch (error) {
        console.error('自动保存失败:', error)
        setSaveStatus('error')
      }
    }
    
    const intervalId = setInterval(saveData, interval)
    
    // 组件卸载时清理
    return () => {
      clearInterval(intervalId)
    }
  }, [data, onSave, interval])
  
  // 页面关闭前保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveData()
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [data])
  
  const loadAutoSave = () => {
    try {
      const savedData = localStorage.getItem('gameAutoSave')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setLastSaved(new Date())
        setSaveStatus('loaded')
        return parsedData
      }
    } catch (error) {
      console.error('加载自动保存失败:', error)
      setSaveStatus('error')
    }
    return null
  }
  
  return (
    <div className="auto-save">
      <span className={`save-status ${saveStatus}`}>
        {saveStatus === 'idle' && '💾 准备自动保存'}
        {saveStatus === 'saving' && '⏳ 正在保存...'}
        {saveStatus === 'saved' && `✅ 已保存 ${lastSaved?.toLocaleTimeString()}`}
        {saveStatus === 'error' && '❌ 保存失败'}
        {saveStatus === 'loaded' && '📂 已加载存档'}
      </span>
    </div>
  )
}

export default DebugPanel