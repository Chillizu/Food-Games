import React, { Suspense } from 'react'
import { useGameLogic } from '../../hooks/useGameLogic'
import IntroScreen from './IntroScreen'
import FoodSelectionScreen from './FoodSelectionScreen'
import CookingScreen from './CookingScreen'
import ResultScreen from './ResultScreen'
import LoadingSpinner from '../UI/LoadingSpinner'

const GameContainer = () => {
  const {
    gameStage,
    selectedFoods,
    additionalRecipes,
    planetHistory,
    gameStats,
    environmentalImpact,
    planetStatus,
    currentRecipe,
    tips,
    unlockedAchievements,
    selectFood,
    deselectFood,
    startCooking,
    completeCooking,
    restartGame,
    resetGame,
    startNewGame,
    canStartCooking
  } = useGameLogic()

  const renderCurrentScreen = () => {
    switch (gameStage) {
      case 'intro':
        return (
          <IntroScreen 
            onStartGame={startNewGame}
            gameStats={gameStats}
          />
        )
      
      case 'selecting':
        return (
          <FoodSelectionScreen
            selectedFoods={selectedFoods}
            onSelectFood={selectFood}
            onDeselectFood={deselectFood}
            onStartCooking={startCooking}
            canStartCooking={canStartCooking}
          />
        )
      
      case 'cooking':
        return (
          <CookingScreen
            selectedFoods={selectedFoods}
            onCompleteCooking={completeCooking}
          />
        )
      
      case 'result':
        return (
          <ResultScreen
            selectedFoods={selectedFoods}
            environmentalImpact={environmentalImpact}
            planetStatus={planetStatus}
            currentRecipe={currentRecipe}
            additionalRecipes={additionalRecipes || []}
            planetHistory={planetHistory || []}
            tips={tips}
            unlockedAchievements={unlockedAchievements}
            onRestart={restartGame}
            onNewGame={startNewGame}
          />
        )
      
      default:
        return <IntroScreen onStartGame={startNewGame} />
    }
  }

  return (
    <div className="game-container">
      <Suspense fallback={<LoadingSpinner />}>
        {renderCurrentScreen()}
      </Suspense>
    </div>
  )
}

export default GameContainer