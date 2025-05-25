"use client"

import { useState, useEffect } from "react"
import { EMOJI_CATEGORIES } from "./CategoryPicker"
import "./GameBoard.css"

function GameBoard({ playerCategories, onGameEnd, onNewGame }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [playerEmojis, setPlayerEmojis] = useState({
    player1: [],
    player2: [],
  })
  const [playerPositions, setPlayerPositions] = useState({
    player1: [],
    player2: [],
  })
  const [currentEmoji, setCurrentEmoji] = useState("")
  const [winner, setWinner] = useState(null)
  const [winningCells, setWinningCells] = useState([])

  // Get random emoji from player's category
  const getRandomEmoji = (playerNum) => {
    const categoryName = playerCategories[`player${playerNum}`]
    const categoryEmojis = EMOJI_CATEGORIES[categoryName]
    return categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)]
  }

  // Initialize first emoji
  useEffect(() => {
    setCurrentEmoji(getRandomEmoji(1))
  }, [])

  // Play sound effect
  const playSound = (type) => {
    try {
      // Create audio context for beep sounds
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      let frequency = 440
      let duration = 0.1

      switch (type) {
        case "place":
          frequency = 800
          duration = 0.1
          break
        case "vanish":
          frequency = 300
          duration = 0.2
          break
        case "win":
          frequency = 600
          duration = 0.5
          break
        case "error":
          frequency = 200
          duration = 0.3
          break
      }

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.log("Audio not supported")
    }
  }

  const checkWinner = (boardState, p1Emojis, p2Emojis) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      if (boardState[a] && boardState[b] && boardState[c]) {
        // Check if all three belong to player 1
        if (p1Emojis.includes(boardState[a]) && p1Emojis.includes(boardState[b]) && p1Emojis.includes(boardState[c])) {
          return { winner: "player1", cells: pattern }
        }
        // Check if all three belong to player 2
        if (p2Emojis.includes(boardState[a]) && p2Emojis.includes(boardState[b]) && p2Emojis.includes(boardState[c])) {
          return { winner: "player2", cells: pattern }
        }
      }
    }
    return null
  }

  const handleCellClick = (index) => {
    if (board[index] || winner) return

    const playerKey = `player${currentPlayer}`
    const currentPlayerEmojis = playerEmojis[playerKey]
    const currentPlayerPositions = playerPositions[playerKey]

    // Check if trying to place on recently vanished position
    if (currentPlayerEmojis.length === 3 && index === currentPlayerPositions[0]) {
      playSound("error")
      return
    }

    playSound("place")

    // Create new board state
    const newBoard = [...board]
    newBoard[index] = currentEmoji

    // Update player's emojis and positions
    const newEmojis = [...currentPlayerEmojis, currentEmoji]
    const newPositions = [...currentPlayerPositions, index]

    // Handle vanishing rule
    if (newEmojis.length > 3) {
      newEmojis.shift() // Remove oldest emoji
      const vanishedPosition = newPositions.shift() // Remove oldest position
      newBoard[vanishedPosition] = null // Clear from board
      playSound("vanish")
    }

    // Update state
    setBoard(newBoard)
    setPlayerEmojis((prev) => ({
      ...prev,
      [playerKey]: newEmojis,
    }))
    setPlayerPositions((prev) => ({
      ...prev,
      [playerKey]: newPositions,
    }))

    // Check for winner
    const result = checkWinner(
      newBoard,
      currentPlayer === 1 ? newEmojis : playerEmojis.player1,
      currentPlayer === 2 ? newEmojis : playerEmojis.player2,
    )

    if (result) {
      setWinner(result.winner)
      setWinningCells(result.cells)
      playSound("win")
      setTimeout(() => onGameEnd(result.winner), 1000)
    } else {
      // Switch players
      const nextPlayer = currentPlayer === 1 ? 2 : 1
      setCurrentPlayer(nextPlayer)
      setCurrentEmoji(getRandomEmoji(nextPlayer))
    }
  }

  return (
    <div className="game-board">
      <div className="game-info">
        {!winner ? (
          <div className="turn-info">
            <h3>Player {currentPlayer}'s Turn</h3>
            <div className="current-emoji">{currentEmoji}</div>
            <p>Emojis on board: {playerEmojis[`player${currentPlayer}`].length}/3</p>
          </div>
        ) : (
          <div className="winner-info">
            <h3>Player {winner.slice(-1)} Wins!</h3>
          </div>
        )}
      </div>

      <div className="board-grid">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`board-cell ${winningCells.includes(index) ? "winning" : ""}`}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      <div className="game-controls">
        <button onClick={onNewGame}>New Game</button>
      </div>

      <div className="game-rules">
        <h4>Quick Rules:</h4>
        <ul>
          <li>Get 3 in a row to win</li>
          <li>Max 3 emojis per player on board</li>
          <li>Oldest emoji vanishes when placing 4th</li>
          <li>Can't place where your emoji just vanished</li>
        </ul>
      </div>
    </div>
  )
}

export default GameBoard
