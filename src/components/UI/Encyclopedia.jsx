import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import foodsData from '../../data/foods.json';
import './Encyclopedia.module.css';

const Encyclopedia = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSDG, setSelectedSDG] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [collectedFoods, setCollectedFoods] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedFood, setSelectedFood] = useState(null);

  // SDG 目标映射
  const sdgGoals = {
    'SDG1': { name: '无贫穷', icon: '🏠', color: '#4ade80' },
    'SDG2': { name: '零饥饿', icon: '🍎', color: '#f87171' },
    'SDG3': { name: '良好健康', icon: '❤️', color: '#fbbf24' },
    'SDG4': { name: '优质教育', icon: '📚', color: '#60a5fa' },
    'SDG5': { name: '性别平等', icon: '♀️', color: '#ec4899' },
    'SDG6': { name: '清洁饮水', icon: '💧', color: '#06b6d4' },
    'SDG7': { name: '廉价能源', icon: '⚡', color: '#f59e0b' },
    'SDG8': { name: '体面工作', icon: '💼', color: '#8b5cf6' },
    'SDG9': { name: '工业创新', icon: '🔧', color: '#a78bfa' },
    'SDG10': { name: '减少不平等', icon: '⚖️', color: '#f97316' },
    'SDG11': { name: '可持续城市', icon: '🏙️', color: '#84cc16' },
    'SDG12': { name: '负责任消费', icon: '♻️', color: '#10b981' },
    'SDG13': { name: '气候行动', icon: '🌍', color: '#06b6d4' },
    'SDG14': { name: '水下生物', icon: '🐠', color: '#0ea5e9' },
    'SDG15': { name: '陆地生物', icon: '🌳', color: '#22c55e' },
    'SDG16': { name: '和平正义', icon: '🕊️', color: '#64748b' },
    'SDG17': { name: '伙伴关系', icon: '🤝', color: '#6366f1' }
  };

  // 稀有度映射
  const rarityMap = {
    'common': { name: '普通', color: '#9ca3af', bgColor: '#f3f4f6' },
    'uncommon': { name: '稀有', color: '#10b981', bgColor: '#d1fae5' },
    'rare': { name: '史诗', color: '#3b82f6', bgColor: '#dbeafe' },
    'legendary': { name: '传说', color: '#f59e0b', bgColor: '#fef3c7' }
  };

  // 初始化收集状态
  useEffect(() => {
    // 从 localStorage 获取已收集的食材
    const savedCollected = localStorage.getItem('collectedFoods');
    if (savedCollected) {
      setCollectedFoods(JSON.parse(savedCollected));
    } else {
      // 默认解锁所有普通食材
      const initialCollected = foodsData.foods
        .filter(food => food.rarity === 'common')
        .map(food => food.id);
      setCollectedFoods(initialCollected);
      localStorage.setItem('collectedFoods', JSON.stringify(initialCollected));
    }
  }, []);

  // 保存收集状态
  const saveCollectedFoods = (newCollected) => {
    setCollectedFoods(newCollected);
    localStorage.setItem('collectedFoods', JSON.stringify(newCollected));
  };

  // 发现新食材
  const discoverFood = (foodId) => {
    if (!collectedFoods.includes(foodId)) {
      const newCollected = [...collectedFoods, foodId];
      saveCollectedFoods(newCollected);
    }
  };

  // 过滤和排序食材
  const filteredFoods = foodsData.foods
    .filter(food => {
      // 类别过滤
      if (selectedCategory !== 'all' && food.category !== selectedCategory) return false;
      
      // SDG 过滤
      if (selectedSDG !== 'all' && !food.sdgGoals.includes(selectedSDG)) return false;
      
      // 搜索过滤
      if (searchTerm && !food.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !food.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { 'common': 0, 'uncommon': 1, 'rare': 2, 'legendary': 3 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'sdg':
          return a.sdgGoals.length - b.sdgGoals.length;
        default:
          return 0;
      }
    });

  // 获取所有可用的 SDG 目标
  const availableSDGs = [...new Set(foodsData.foods.flatMap(food => food.sdgGoals))];

  // 获取收集统计
  const collectionStats = {
    total: foodsData.foods.length,
    collected: collectedFoods.length,
    byCategory: foodsData.categories ? Object.keys(foodsData.categories).reduce((acc, category) => {
      acc[category] = foodsData.foods.filter(food => food.category === category).length;
      return acc;
    }, {}) : {},
    byRarity: Object.keys(rarityMap).reduce((acc, rarity) => {
      acc[rarity] = foodsData.foods.filter(food => food.rarity === rarity).length;
      return acc;
    }, {})
  };

  // 渲染 SDG 标签
  const renderSDGBadges = (sdgGoals) => {
    return (
      <div className="sdg-badges">
        {sdgGoals.map(sdg => (
          <span 
            key={sdg} 
            className="sdg-badge"
            style={{ backgroundColor: sdgGoals[sdg]?.color || '#e5e7eb' }}
            title={sdgGoals[sdg]?.name || sdg}
          >
            {sdgGoals[sdg]?.icon || '🎯'}
          </span>
        ))}
      </div>
    );
  };

  // 渲染单个食材卡片
  const renderFoodCard = (food) => {
    const isCollected = collectedFoods.includes(food.id);
    const rarity = rarityMap[food.rarity] || rarityMap.common;
    
    return (
      <motion.div
        key={food.id}
        className={`food-card ${isCollected ? 'collected' : 'locked'} ${viewMode}`}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => isCollected && setSelectedFood(food)}
      >
        <div className="card-header">
          <div className="food-emoji">{food.emoji}</div>
          <div className="card-title">
            <h3>{food.name}</h3>
            <div className="rarity-badge" style={{ 
              color: rarity.color, 
              backgroundColor: rarity.bgColor 
            }}>
              {rarity.name}
            </div>
          </div>
        </div>
        
        <div className="card-content">
          <p className="description">{food.description}</p>
          
          {isCollected ? (
            <>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">碳足迹</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill carbon" 
                      style={{ width: `${food.carbonFootprint * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">水耗</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill water" 
                      style={{ width: `${food.waterUsage * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">健康度</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill health" 
                      style={{ width: `${food.healthScore * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="sdg-section">
                <h4>SDG 贡献</h4>
                <div className="sdg-list">
                  {food.sdgGoals.map(sdg => (
                    <span 
                      key={sdg} 
                      className="sdg-item"
                      style={{ backgroundColor: sdgGoals[sdg]?.color + '20' }}
                      title={sdgGoals[sdg]?.name}
                    >
                      {sdgGoals[sdg]?.icon} {sdgGoals[sdg]?.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="fun-fact">
                <span className="fact-icon">💡</span>
                <p>{food.funFact}</p>
              </div>
            </>
          ) : (
            <div className="unlock-info">
              <span className="lock-icon">🔒</span>
              <p>{food.unlockCondition}</p>
            </div>
          )}
        </div>
        
        <div className="card-footer">
          {isCollected ? (
            <span className="collected-status">已收集</span>
          ) : (
            <span className="locked-status">未收集</span>
          )}
        </div>
      </motion.div>
    );
  };

  // 渲染食材详情
  const renderFoodDetail = (food) => {
    const rarity = rarityMap[food.rarity] || rarityMap.common;
    
    return (
      <motion.div 
        className="food-detail-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="detail-header">
          <div className="detail-emoji">{food.emoji}</div>
          <div className="detail-title">
            <h2>{food.name}</h2>
            <div className="rarity-badge" style={{ 
              color: rarity.color, 
              backgroundColor: rarity.bgColor 
            }}>
              {rarity.name}
            </div>
          </div>
          <button 
            className="close-detail"
            onClick={() => setSelectedFood(null)}
          >
            ✕
          </button>
        </div>
        
        <div className="detail-content">
          <div className="detail-section">
            <h3>基本信息</h3>
            <p>{food.description}</p>
          </div>
          
          <div className="detail-section">
            <h3>环境影响</h3>
            <div className="impact-stats">
              <div className="impact-item">
                <span className="impact-label">碳足迹</span>
                <div className="impact-bar">
                  <div 
                    className="impact-fill carbon" 
                    style={{ width: `${food.carbonFootprint * 100}%` }}
                  ></div>
                </div>
                <span className="impact-value">{(food.carbonFootprint * 100).toFixed(0)}%</span>
              </div>
              <div className="impact-item">
                <span className="impact-label">水耗</span>
                <div className="impact-bar">
                  <div 
                    className="impact-fill water" 
                    style={{ width: `${food.waterUsage * 100}%` }}
                  ></div>
                </div>
                <span className="impact-value">{(food.waterUsage * 100).toFixed(0)}%</span>
              </div>
              <div className="impact-item">
                <span className="impact-label">土地占用</span>
                <div className="impact-bar">
                  <div 
                    className="impact-fill land" 
                    style={{ width: `${food.landUsage * 100}%` }}
                  ></div>
                </div>
                <span className="impact-value">{(food.landUsage * 100).toFixed(0)}%</span>
              </div>
              <div className="impact-item">
                <span className="impact-label">健康指数</span>
                <div className="impact-bar">
                  <div 
                    className="impact-fill health" 
                    style={{ width: `${food.healthScore * 100}%` }}
                  ></div>
                </div>
                <span className="impact-value">{(food.healthScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
          
          <div className="detail-section">
            <h3>SDG 贡献</h3>
            <div className="sdg-detail-grid">
              {food.sdgGoals.map(sdg => (
                <div key={sdg} className="sdg-detail-item">
                  <div 
                    className="sdg-icon"
                    style={{ backgroundColor: sdgGoals[sdg]?.color + '20' }}
                  >
                    {sdgGoals[sdg]?.icon}
                  </div>
                  <div className="sdg-info">
                    <h4>{sdgGoals[sdg]?.name}</h4>
                    <p>{sdg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="detail-section">
            <h3>趣味知识</h3>
            <div className="fun-fact-detail">
              <span className="fact-icon">💡</span>
              <p>{food.funFact}</p>
            </div>
          </div>
          
          <div className="detail-section">
            <h3>解锁条件</h3>
            <div className="unlock-condition">
              <span className="condition-icon">🔓</span>
              <p>{food.unlockCondition}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="encyclopedia-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        className="encyclopedia-container"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="encyclopedia-header">
          <div className="header-left">
            <h1>食材图鉴</h1>
            <div className="collection-progress">
              <span className="progress-text">
                已收集 {collectedFoods.length} / {foodsData.foods.length}
              </span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(collectedFoods.length / foodsData.foods.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="view-toggle"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? '📋 列表' : '⊞ 网格'}
            </button>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="encyclopedia-stats">
          <div className="stat-card">
            <h3>收集进度</h3>
            <div className="stat-value">
              {Math.round((collectedFoods.length / foodsData.foods.length) * 100)}%
            </div>
            <div className="stat-detail">
              {collectedFoods.length} / {foodsData.foods.length} 种食材
            </div>
          </div>
          
          {foodsData.categories && (
            <div className="stat-card">
              <h3>类别分布</h3>
              <div className="category-stats">
                {Object.entries(foodsData.categories).map(([key, category]) => {
                  const count = foodsData.foods.filter(food => food.category === key).length;
                  const collectedCount = foodsData.foods
                    .filter(food => food.category === key && collectedFoods.includes(food.id))
                    .length;
                  return (
                    <div key={key} className="category-stat-item">
                      <span 
                        className="category-color"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">
                        {collectedCount}/{count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="stat-card">
            <h3>稀有度分布</h3>
            <div className="rarity-stats">
              {Object.entries(rarityMap).map(([rarity, info]) => {
                const count = foodsData.foods.filter(food => food.rarity === rarity).length;
                const collectedCount = foodsData.foods
                  .filter(food => food.rarity === rarity && collectedFoods.includes(food.id))
                  .length;
                return (
                  <div key={rarity} className="rarity-stat-item">
                    <span 
                      className="rarity-dot"
                      style={{ backgroundColor: info.color }}
                    ></span>
                    <span className="rarity-name">{info.name}</span>
                    <span className="rarity-count">
                      {collectedCount}/{count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div className="encyclopedia-filters">
          <div className="filter-group">
            <label>类别:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">全部</option>
              {foodsData.categories && Object.entries(foodsData.categories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>SDG目标:</label>
            <select 
              value={selectedSDG} 
              onChange={(e) => setSelectedSDG(e.target.value)}
            >
              <option value="all">全部</option>
              {availableSDGs.map(sdg => (
                <option key={sdg} value={sdg}>
                  {sdgGoals[sdg]?.icon} {sdgGoals[sdg]?.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>搜索:</label>
            <input
              type="text"
              placeholder="搜索食材..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label>排序:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">名称</option>
              <option value="rarity">稀有度</option>
              <option value="sdg">SDG数量</option>
            </select>
          </div>
        </div>

        {/* 食材列表 */}
        <div className={`encyclopedia-content ${viewMode}`}>
          <AnimatePresence>
            {filteredFoods.map(food => renderFoodCard(food))}
          </AnimatePresence>
        </div>

        {/* 食材详情模态框 */}
        <AnimatePresence>
          {selectedFood && renderFoodDetail(selectedFood)}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Encyclopedia;