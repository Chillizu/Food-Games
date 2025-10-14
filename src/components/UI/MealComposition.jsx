import React from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const MealComposition = ({ foundRecipes, unmatchedFoods }) => {
  if (foundRecipes.length === 0 && unmatchedFoods.length === 0) {
    return null;
  }

  return (
    <div className="meal-composition">
      {foundRecipes.length > 0 && (
        <div className="composition-section">
          <h3 className="composition-section__title">菜品组合</h3>
          <motion.div
            className="composition-section__list"
            variants={{
              visible: { transition: { staggerChildren: 0.07 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {foundRecipes.map(recipe => (
              <motion.div key={recipe.id} className="composition-item recipe-item" variants={itemVariants}>
                <span className="composition-item__icon">{recipe.icon}</span>
                <div className="composition-item__details">
                  <span className="composition-item__name">{recipe.name}</span>
                  <span className="composition-item__ingredients">{recipe.ingredients.join(' + ')}</span>
                </div>
                <span className="composition-item__bonus">+{recipe.bonusScore}分</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {unmatchedFoods.length > 0 && (
        <div className="composition-section">
          <h3 className="composition-section__title">独立食材</h3>
          <motion.div
            className="composition-section__list"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {unmatchedFoods.map(food => (
              <motion.div key={food.id} className="composition-item food-item" variants={itemVariants}>
                <span className="composition-item__icon">{food.emoji}</span>
                <div className="composition-item__details">
                  <span className="composition-item__name">{food.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MealComposition;