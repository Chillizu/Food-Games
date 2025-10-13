import React, { useState, useEffect } from 'react'
import { useAchievements } from './AchievementManager'
import { 
  AchievementBadge, 
  StarRating, 
  Timeline,
  TagCloud 
} from './DecorativeElements'
import IconComponents from './IconComponents'

// 成就筛选选项
const FILTER_OPTIONS = {
  all: '全部',
  unlocked: '已解锁',
  locked: '未解锁',
  recipe: '食谱成就',
  environmental: '环保成就',
  cooking: '烹饪成就',
  ingredient: '食材成就',
  score: '评分成就',
  combo: '连击成就'
}

// 稀有度排序
const RARITY_ORDER = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4
}

// 成就画廊组件
export const AchievementGallery = () => {
  const { 
    getAllAchievements, 
    getAchievementStats,
    getUnlockedAchievements,
    getLockedAchievements 
  } = useAchievements()
  
  const [achievements, setAchievements] = useState([])
  const [filteredAchievements, setFilteredAchievements] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('rarity')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [stats, setStats] = useState(null)
  
  // 初始化数据
  useEffect(() => {
    const allAchievements = getAllAchievements()
    setAchievements(allAchievements)
    setFilteredAchievements(allAchievements)
    setStats(getAchievementStats())
  }, [getAllAchievements, getAchievementStats])
  
  // 筛选和搜索成就
  useEffect(() => {
    let filtered = achievements
    
    // 按筛选条件
    switch (selectedFilter) {
      case 'unlocked':
        filtered = getUnlockedAchievements()
        break
      case 'locked':
        filtered = getLockedAchievements()
        break
      default:
        // 按类别筛选
        const categoryMap = {
          recipe: 'recipe',
          environmental: 'environmental',
          cooking: 'cooking',
          ingredient: 'ingredient',
          score: 'score',
          combo: 'combo'
        }
        if (categoryMap[selectedFilter]) {
          filtered = achievements.filter(a => a.category === categoryMap[selectedFilter])
        }
    }
    
    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(achievement =>
        achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // 排序
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity]
        case 'name':
          return a.name.localeCompare(b.name)
        case 'progress':
          return b.progress - a.progress
        case 'recent':
          return new Date(b.unlockedAt) - new Date(a.unlockedAt)
        default:
          return 0
      }
    })
    
    setFilteredAchievements(filtered)
  }, [achievements, selectedFilter, sortBy, searchTerm, getUnlockedAchievements, getLockedAchievements])
  
  // 获取稀有度颜色
  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-600 bg-gray-100',
      rare: 'text-blue-600 bg-blue-100',
      epic: 'text-purple-600 bg-purple-100',
      legendary: 'text-yellow-600 bg-yellow-100'
    }
    return colors[rarity] || colors.common
  }
  
  // 获取进度条颜色
  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }
  
  return (
    <div className="achievement-gallery">
      {/* 头部统计 */}
      <div className="gallery-header">
        <h2>🏆 成就图鉴</h2>
        {stats && (
          <div className="achievement-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.unlocked}</span>
              <span className="stat-label">已解锁</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">总成就</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.progress}%</span>
              <span className="stat-label">完成度</span>
            </div>
          </div>
        )}
      </div>
      
      {/* 筛选和搜索 */}
      <div className="gallery-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="搜索成就..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="filter-select"
          >
            {Object.entries(FILTER_OPTIONS).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="rarity">按稀有度</option>
            <option value="name">按名称</option>
            <option value="progress">按进度</option>
            <option value="recent">按解锁时间</option>
          </select>
        </div>
      </div>
      
      {/* 成就网格 */}
      <div className="achievements-grid">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            onClick={() => setSelectedAchievement(achievement)}
          >
            <div className="achievement-header">
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-title-section">
                <h3 className="achievement-title">{achievement.name}</h3>
                <div className={`achievement-rarity ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </div>
              </div>
            </div>
            
            <p className="achievement-description">{achievement.description}</p>
            
            {/* 进度条 */}
            {!achievement.unlocked && (
              <div className="achievement-progress">
                <div className="progress-info">
                  <span>进度</span>
                  <span>{achievement.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${getProgressColor(achievement.progress)}`}
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* 已解锁标记 */}
            {achievement.unlocked && (
              <div className="achievement-unlocked">
                <span className="unlocked-badge">✅ 已解锁</span>
                <div className="unlocked-date">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              </div>
            )}
            
            {/* 类别标签 */}
            <div className="achievement-category">
              <span className="category-tag">
                {achievement.category}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* 空状态 */}
      {filteredAchievements.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h3>没有找到成就</h3>
          <p>尝试调整筛选条件或搜索关键词</p>
        </div>
      )}
      
      {/* 成就详情模态框 */}
      {selectedAchievement && (
        <div className="achievement-modal" onClick={() => setSelectedAchievement(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="achievement-icon-large">{selectedAchievement.icon}</div>
              <div className="modal-title-section">
                <h2>{selectedAchievement.name}</h2>
                <div className={`achievement-rarity ${getRarityColor(selectedAchievement.rarity)}`}>
                  {selectedAchievement.rarity}
                </div>
              </div>
              <button 
                className="modal-close"
                onClick={() => setSelectedAchievement(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="achievement-info">
                <h3>成就描述</h3>
                <p>{selectedAchievement.description}</p>
                
                <h3>类别</h3>
                <p>{selectedAchievement.category}</p>
                
                {!selectedAchievement.unlocked && (
                  <>
                    <h3>解锁进度</h3>
                    <div className="progress-details">
                      <div className="progress-bar-large">
                        <div 
                          className={`progress-fill ${getProgressColor(selectedAchievement.progress)}`}
                          style={{ width: `${selectedAchievement.progress}%` }}
                        />
                      </div>
                      <span>{selectedAchievement.progress}%</span>
                    </div>
                  </>
                )}
                
                {selectedAchievement.unlocked && (
                  <>
                    <h3>解锁时间</h3>
                    <p>{new Date(selectedAchievement.unlockedAt).toLocaleString()}</p>
                    
                    <h3>奖励徽章</h3>
                    <div className="reward-badge">
                      <div className="badge-icon">
                        {selectedAchievement.badge?.icon || '🏆'}
                      </div>
                      <div className="badge-info">
                        <h4>{selectedAchievement.badge?.name || '神秘徽章'}</h4>
                        <p>{selectedAchievement.badge?.description || '特殊奖励'}</p>
                      </div>
                    </div>
                  </>
                )}
                
                <h3>解锁条件</h3>
                <div className="requirements">
                  {renderRequirements(selectedAchievement.requirements)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 渲染解锁条件
const renderRequirements = (requirements) => {
  switch (requirements.type) {
    case 'recipe_count':
      return <p>制作 {requirements.target} 种食谱</p>
    case 'streak_score':
      return <p>连续 {requirements.target} 次获得 {requirements.minScore} 分以上</p>
    case 'total_cooking':
      return <p>总共制作 {requirements.target} 道菜</p>
    case 'ingredient_type':
      return <p>使用 {requirements.ingredientType} 食材制作 {requirements.target} 道菜</p>
    case 'first_use':
      return <p>首次使用 {requirements.ingredientType} 食材</p>
    case 'perfect_score':
      return <p>获得 {requirements.target} 分完美评分</p>
    case 'max_selection':
      return <p>单次选择 {requirements.target} 种食材</p>
    case 'resource_efficiency':
      return <p>{requirements.target} 次游戏 {requirements.resourceType} 使用率低于 {Math.round(requirements.maxUsage * 100)}%</p>
    default:
      return <p>特殊条件</p>
  }
}

// 成就时间线组件
export const AchievementTimeline = () => {
  const { getUnlockedAchievements } = useAchievements()
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  
  useEffect(() => {
    setUnlockedAchievements(getUnlockedAchievements())
  }, [getUnlockedAchievements])
  
  // 按解锁时间排序
  const sortedAchievements = [...unlockedAchievements].sort((a, b) => 
    new Date(b.unlockedAt) - new Date(a.unlockedAt)
  )
  
  return (
    <div className="achievement-timeline">
      <h3>📅 成就解锁时间线</h3>
      {sortedAchievements.length > 0 ? (
        <Timeline
          items={sortedAchievements.map(achievement => ({
            date: new Date(achievement.unlockedAt).toLocaleDateString(),
            title: achievement.name,
            description: achievement.description,
            icon: achievement.icon
          }))}
        />
      ) : (
        <div className="empty-timeline">
          <p>还没有解锁任何成就</p>
          <p>开始游戏来解锁你的第一个成就吧！</p>
        </div>
      )}
    </div>
  )
}

// 成就统计组件
export const AchievementStats = () => {
  const { getAchievementStats } = useAchievements()
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    setStats(getAchievementStats())
  }, [getAchievementStats])
  
  if (!stats) return null
  
  return (
    <div className="achievement-stats">
      <h3>📊 成就统计</h3>
      
      <div className="overall-stats">
        <div className="stat-circle">
          <div className="stat-number">{stats.progress}%</div>
          <div className="stat-label">完成度</div>
        </div>
        
        <div className="stat-details">
          <div className="stat-item">
            <span className="stat-label">总成就数</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">已解锁</span>
            <span className="stat-value">{stats.unlocked}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">剩余</span>
            <span className="stat-value">{stats.total - stats.unlocked}</span>
          </div>
        </div>
      </div>
      
      <div className="category-stats">
        <h4>分类统计</h4>
        <div className="category-grid">
          {Object.entries(stats.categories).map(([category, data]) => (
            <div key={category} className="category-item">
              <div className="category-name">{category}</div>
              <div className="category-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(data.unlocked / data.total) * 100}%`,
                      background: getCategoryColor(category)
                    }}
                  />
                </div>
                <span>{data.unlocked}/{data.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 获取分类颜色
const getCategoryColor = (category) => {
  const colors = {
    recipe: '#4ade80',
    environmental: '#22c55e',
    cooking: '#f59e0b',
    ingredient: '#3b82f6',
    score: '#ef4444',
    combo: '#8b5cf6'
  }
  return colors[category] || '#6b7280'
}

export default AchievementGallery