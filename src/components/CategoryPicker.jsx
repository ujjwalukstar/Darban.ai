"use client"

import { useState } from "react"
import "./CategoryPicker.css"

const EMOJI_CATEGORIES = {
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
  food: ["🍎", "🍌", "🍊", "🍇", "🍓", "🥝", "🍑", "🥭"],
  sports: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏓", "🏸"],
  nature: ["🌸", "🌺", "🌻", "🌷", "🌹", "🌼", "💐", "🌿"],
  vehicles: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑"],
  objects: ["⭐", "💎", "🔥", "💧", "⚡", "🌙", "☀️", "🌈"],
}

function CategoryPicker({ playerCategories, setPlayerCategories, onStartGame }) {
  const [selectedPlayer, setSelectedPlayer] = useState(1)

  const selectCategory = (category) => {
    const playerKey = `player${selectedPlayer}`
    const otherPlayerKey = selectedPlayer === 1 ? "player2" : "player1"

    // Don't allow same category for both players
    if (playerCategories[otherPlayerKey] === category) {
      alert("Other player already selected this category!")
      return
    }

    setPlayerCategories((prev) => ({
      ...prev,
      [playerKey]: category,
    }))

    // Auto switch to other player if they haven't selected yet
    if (selectedPlayer === 1 && !playerCategories.player2) {
      setSelectedPlayer(2)
    } else if (selectedPlayer === 2 && !playerCategories.player1) {
      setSelectedPlayer(1)
    }
  }

  const canStartGame = playerCategories.player1 && playerCategories.player2

  return (
    <div className="category-picker">
      <h2>Choose Your Emoji Categories</h2>

      <div className="player-selector">
        <button className={selectedPlayer === 1 ? "active" : ""} onClick={() => setSelectedPlayer(1)}>
          Player 1 {playerCategories.player1 && `(${playerCategories.player1})`}
        </button>
        <button className={selectedPlayer === 2 ? "active" : ""} onClick={() => setSelectedPlayer(2)}>
          Player 2 {playerCategories.player2 && `(${playerCategories.player2})`}
        </button>
      </div>

      <div className="categories-grid">
        {Object.entries(EMOJI_CATEGORIES).map(([categoryName, emojis]) => (
          <div
            key={categoryName}
            className={`category-card ${
              playerCategories.player1 === categoryName || playerCategories.player2 === categoryName ? "selected" : ""
            }`}
            onClick={() => selectCategory(categoryName)}
          >
            <h3>{categoryName}</h3>
            <div className="emoji-preview">
              {emojis.slice(0, 4).map((emoji, index) => (
                <span key={index}>{emoji}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {canStartGame && (
        <button className="start-button" onClick={onStartGame}>
          Start Game!
        </button>
      )}
    </div>
  )
}

export default CategoryPicker
export { EMOJI_CATEGORIES }
