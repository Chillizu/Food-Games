import foodsData from '../data/foods.json'
import achievementsData from '../data/achievements.json'
import recipesData from '../data/recipes.json'
import sdgsData from '../data/sdgs.json'

// 计算环境影响分数
export function calculateEnvironmentalImpact(selectedFoods) {
  if (!selectedFoods || selectedFoods.length === 0) {
    return {
      carbonFootprint: 0,
      waterUsage: 0,
      landUsage: 0,
      healthScore: 0,
      totalScore: 0
    };
  }

  // --- 1. 计算各项指标的平均值 ---
  const count = selectedFoods.length;
  const averages = selectedFoods.reduce((acc, food) => {
    acc.carbonFootprint += food.carbonFootprint;
    acc.waterUsage += food.waterUsage;
    acc.landUsage += food.landUsage;
    acc.healthScore += food.healthScore;
    return acc;
  }, { carbonFootprint: 0, waterUsage: 0, landUsage: 0, healthScore: 0 });

  for (let key in averages) {
    averages[key] /= count;
  }

  // --- 2. 定义评分模型参数 ---
  const baselines = {
    carbon: 0.5, // 理想碳排放基准
    water: 0.6,  // 理想水资源消耗基准
    land: 0.4,   // 理想土地使用基准
  };
  const penaltyFactor = 60; // 超出基准线的惩罚乘数，越高惩罚越重
  const weights = {
    health: 0.4,
    environment: 0.6,
    carbon: 0.4,
    water: 0.3,
    land: 0.3,
  };

  // --- 3. 计算各分项得分 (0-100) ---

  // 环境影响项的评分函数（扣分制）
  const calculateImpactSubScore = (value, baseline) => {
    const baselineScore = 80; // 达到基准线时的得分
    if (value <= baseline) {
      // 低于基准，得分在80-100之间
      return 100 - (value / baseline) * (100 - baselineScore);
    } else {
      // 高于基准，从80分开始扣分
      const penalty = (value - baseline) * penaltyFactor;
      return baselineScore - penalty;
    }
  };

  const healthScore = averages.healthScore * 100;
  const carbonScore = calculateImpactSubScore(averages.carbonFootprint, baselines.carbon);
  const waterScore = calculateImpactSubScore(averages.waterUsage, baselines.water);
  const landScore = calculateImpactSubScore(averages.landUsage, baselines.land);

  // --- 4. 加权计算最终总分 ---
  const environmentScore =
    carbonScore * weights.carbon +
    waterScore * weights.water +
    landScore * weights.land;

  const finalScore =
    healthScore * weights.health +
    environmentScore * weights.environment;

  return {
    ...averages,
    totalScore: Math.round(Math.max(0, Math.min(100, finalScore))),
  };
}

// 计算星球状态
export function calculatePlanetStatus(environmentalScore) {
  if (environmentalScore >= 80) {
    return {
      health: 'excellent',
      color: '#22c55e',
      description: '星球生态完美，生机勃勃！',
      animals: ['🐨', '🦋', '🐠', '🦌'],
      plants: ['🌳', '🌻', '🌺', '🍃']
    }
  } else if (environmentalScore >= 60) {
    return {
      health: 'good',
      color: '#84cc16',
      description: '星球生态良好，继续保持！',
      animals: ['🐿️', '🦆', '🐢', '🐇'],
      plants: ['🌿', '🌱', '🌸', '🌾']
    }
  } else if (environmentalScore >= 40) {
    return {
      health: 'fair',
      color: '#eab308',
      description: '星球生态一般，需要改善',
      animals: ['🐭', '🦎', '🐸', '🦗'],
      plants: ['🌵', '🌾', '🍀', '🌿']
    }
  } else if (environmentalScore >= 20) {
    return {
      health: 'poor',
      color: '#f97316',
      description: '星球生态恶化，急需行动',
      animals: ['🐁', '🐛', '🕷️', '🦟'],
      plants: ['🌾', '🍂', '🌱', '🌵']
    }
  } else {
    return {
      health: 'critical',
      color: '#dc2626',
      description: '星球生态崩溃，必须改变！',
      animals: ['🐜', '🪲', '🦟', '🦗'],
      plants: ['🥀', '🍂', '🌵', '🌱']
    }
  }
}

// 根据分数获取SDG信息
export function getSDGMessage(totalScore) {
  for (const sdg of sdgsData) {
    if (totalScore >= sdg.scoreRange[0] && totalScore < sdg.scoreRange[1]) {
      return sdg;
    }
  }
  return null;
}

// 检查成就解锁
export function checkAchievements(selectedFoods, gameStats) {
  const achievements = []
  const environmentalImpact = calculateEnvironmentalImpact(selectedFoods)
  
  // 初次尝试
  if (gameStats.totalMeals >= 1) {
    achievements.push('first-meal')
  }

  // 环保战士 - 连续5次低碳饮食
  if (gameStats.ecoStreak >= 5) {
    achievements.push('eco-warrior')
  }

  // 美食探索家 - 尝试所有类别
  const categories = new Set(selectedFoods.map(food => food.category))
  if (categories.size === 5) { // plant, animal, insect, lab, processed
    achievements.push('food-explorer')
  }

  // 健康厨师 - 连续3次高健康度
  if (gameStats.healthyStreak >= 3) {
    achievements.push('healthy-chef')
  }

  // 发明家 - 使用实验室食物
  if (selectedFoods.some(food => food.category === 'lab')) {
    achievements.push('inventor')
  }

  // 素食大师 - 连续10次植物性食物
  if (gameStats.vegetarianStreak >= 10) {
    achievements.push('vegetarian-master')
  }

  // 均衡饮食 - 包含所有营养类别
  if (categories.size >= 3 && selectedFoods.length >= 3) {
    achievements.push('balanced-diet')
  }

  // 节水专家 - 低水足迹
  if (environmentalImpact.waterUsage < 0.3) {
    achievements.push('water-saver')
  }

  // 碳中和达人 - 低碳足迹
  if (environmentalImpact.carbonFootprint < 0.2) {
    achievements.push('carbon-neutral')
  }

  // 美食家 - 解锁20种食谱
  if (gameStats.uniqueRecipes >= 20) {
    achievements.push('gourmet-chef')
  }

  return achievements
}

// 识别菜品组合
export function identifyRecipes(selectedFoods) {
  const availableFoodIds = new Set(selectedFoods.map(food => food.id));
  const foodMap = new Map(selectedFoods.map(food => [food.id, food]));
  const matchedRecipes = [];
  const remainingFoods = [...selectedFoods];

  // 贪心算法：优先匹配需要食材最多的菜品
  const sortedRecipes = [...recipesData].sort((a, b) => b.ingredients.length - a.ingredients.length);

  for (const recipe of sortedRecipes) {
    const requiredIngredients = new Set(recipe.ingredients);
    
    // 检查当前可用食材是否能满足菜品需求
    const canMake = [...requiredIngredients].every(id => availableFoodIds.has(id));

    if (canMake) {
      const recipeWithDetails = {
        ...recipe,
        ingredients_details: recipe.ingredients.map(id => foodMap.get(id)).filter(Boolean)
      };
      matchedRecipes.push(recipeWithDetails);
      
      // 从可用食材中移除已用于该菜品的食材
      for (const id of requiredIngredients) {
        availableFoodIds.delete(id);
      }
    }
  }

  // 筛选出未被用于任何菜品的独立食材
  const finalRemainingFoods = remainingFoods.filter(food => availableFoodIds.has(food.id));

  return {
    foundRecipes: matchedRecipes,
    unmatchedFoods: finalRemainingFoods
  };
}

// 获取食材数据
export function getFoods() {
  return foodsData.foods
}

// 获取食材分类
export function getFoodCategories() {
  return foodsData.categories
}

// 获取成就数据
export function getAchievements() {
  return achievementsData.achievements
}

// 获取食谱数据
export function getRecipes() {
  return recipesData
}

// 获取所有食谱，并为每个食谱添加一个随机颜色用于高亮
export function getAllRecipes() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', '#F0CF65', '#D1E65F'];
  return recipesData.map((recipe, index) => ({
    ...recipe,
    color: colors[index % colors.length],
  }));
}

// 生成游戏提示
export function generateTips(environmentalImpact) {
  const tips = []
  
  if (environmentalImpact.carbonFootprint > 0.7) {
    tips.push('🌍 碳排放较高，试试更多蔬菜和植物蛋白吧！')
  }
  
  if (environmentalImpact.waterUsage > 0.6) {
    tips.push('💧 水资源消耗较大，选择当季蔬果更环保')
  }
  
  if (environmentalImpact.healthScore < 0.5) {
    tips.push('❤️ 健康度偏低，建议增加新鲜蔬果摄入')
  }
  
  if (environmentalImpact.totalScore >= 80) {
    tips.push('🎉 太棒了！你的选择对地球很友好')
  }
  
  if (tips.length === 0) {
    tips.push('👍 很好的选择！继续保持健康饮食')
  }
  
  return tips
}