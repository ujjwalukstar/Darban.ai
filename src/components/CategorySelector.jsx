"use client"

import { useState } from "react"
import { emojiCategories } from "../utils/emojiUtils"
import { playSound } from "../utils/soundUtils"
import "./CategorySelector.css"

const CategorySelector = ({ player1Category, player2Category, onSelectCategory, onStartGame, soundEnabled }) => {
  const [selectedCategory1, setSelectedCategory1] = useState(player1Category)
  const [selectedCategory2, setSelectedCategory2] = useState(player2Category)

  const handleCategorySelect = (player, category) => {
    if (soundEnabled) playSound("select")

    if (player === 1) {
      setSelectedCategory1(category)
      onSelectCategory(1, category)
    } else {
      setSelectedCategory2(category)
      onSelectCategory(2, category)
    }
  }

  const handleStartGame = () => {
    if (soundEnabled) playSound("start")
    onStartGame()
  }

  return (
    <div className="category-selector">
      <h2 className="selector-title">Select Your Emoji Categories</h2>

      <div className="players-container">
        <div className="player-section player1-section">
          <h3 className="player-title">Player 1</h3>
          <div className="categories-grid">
            {Object.keys(emojiCategories).map((category) => (
              <button
                key={`p1-${category}`}
                className={`category-btn ${selectedCategory1 === category ? "selected" : ""}`}
                onClick={() => handleCategorySelect(1, category)}
              >
                <span className="category-emoji">{emojiCategories[category][0]}</span>
                <span className="category-name">{category}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="player-section player2-section">
          <h3 className="player-title">Player 2</h3>
          <div className="categories-grid">
            {Object.keys(emojiCategories).map((category) => (
              <button
                key={`p2-${category}`}
                className={`category-btn ${selectedCategory2 === category ? "selected" : ""}`}
                onClick={() => handleCategorySelect(2, category)}
                disabled={category === selectedCategory1}
              >
                <span className="category-emoji">{emojiCategories[category][0]}</span>
                <span className="category-name">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="start-game-container">
        <button
          className="start-game-btn"
          onClick={handleStartGame}
          disabled={!selectedCategory1 || !selectedCategory2}
        >
          🚀 Start Game
        </button>
      </div>
    </div>
  )
}

export default CategorySelector
