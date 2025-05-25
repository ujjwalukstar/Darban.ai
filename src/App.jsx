"use client"

import { useState } from "react"
import GameBoard from "./components/GameBoard"
import CategoryPicker from "./components/CategoryPicker"
import "./App.css"

function App() {
  const [gameState, setGameState] = useState("setup") // 'setup', 'playing', 'finished'
  const [playerCategories, setPlayerCategories] = useState({
    player1: null,
    player2: null,
  })
  const [scores, setScores] = useState({ player1: 0, player2: 0 })

  const startNewGame = () => {
    setGameState("setup")
    setPlayerCategories({ player1: null, player2: null })
  }

  const beginGame = () => {
    if (playerCategories.player1 && playerCategories.player2) {
      setGameState("playing")
    }
  }

  const handleGameEnd = (winner) => {
    setScores((prev) => ({
      ...prev,
      [winner]: prev[winner] + 1,
    }))
    setGameState("finished")
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Blink Tac Toe</h1>
        <div className="score-display">
          <span>Player 1: {scores.player1}</span>
          <span>Player 2: {scores.player2}</span>
        </div>
      </header>

      <main className="app-main">
        {gameState === "setup" && (
          <CategoryPicker
            playerCategories={playerCategories}
            setPlayerCategories={setPlayerCategories}
            onStartGame={beginGame}
          />
        )}

        {gameState === "playing" && (
          <GameBoard playerCategories={playerCategories} onGameEnd={handleGameEnd} onNewGame={startNewGame} />
        )}

        {gameState === "finished" && (
          <div className="game-finished">
            <h2>Game Over!</h2>
            <button onClick={() => setGameState("playing")}>Play Again</button>
            <button onClick={startNewGame}>Choose New Categories</button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
