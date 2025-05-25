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
  // Track the original position of first emoji for each player
  const [firstEmojiPositions, setFirstEmojiPositions] = useState({
    player1: null,
    player2: null,
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

  // Initialize first emoji - FIXED: Added dependency array
  useEffect(() => {
    if (playerCategories.player1) {
      setCurrentEmoji(getRandomEmoji(1))
    }
  }, [playerCategories.player1]) // Fixed line 37 - added proper dependency

  // Play sound effect
  const playSound = (type) => {
    try {
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
        default:
          frequency = 440
          duration = 0.1
      }

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.log("Audio not supported:", error) // Fixed line 79 - added error parameter
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

    // Check if trying to place 4th emoji on the ORIGINAL position of 1st emoji
    if (currentPlayerEmojis.length === 3 && index === firstEmojiPositions[playerKey]) {
      playSound("error")
      alert("Cannot place 4th emoji where your 1st emoji was originally placed!")
      return
    }

    playSound("place")

    // Create new board state
    const newBoard = [...board]
    newBoard[index] = currentEmoji

    // Update player's emojis and positions
    const newEmojis = [...currentPlayerEmojis, currentEmoji]
    const newPositions = [...currentPlayerPositions, index]

    // Track first emoji position when player places their first emoji
    if (currentPlayerEmojis.length === 0) {
      setFirstEmojiPositions((prev) => ({
        ...prev,
        [playerKey]: index,
      }))
    }

    // Handle vanishing rule - FIFO (First In, First Out)
    if (newEmojis.length > 3) {
      newEmojis.shift() // Remove oldest emoji
      const vanishedPosition = newPositions.shift() // Remove oldest position
      newBoard[vanishedPosition] = null // Clear from board
      playSound("vanish")

      // Update first emoji position when it gets removed
      if (newPositions.length > 0) {
        setFirstEmojiPositions((prev) => ({
          ...prev,
          [playerKey]: newPositions[0], // New first emoji position
        }))
      }
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
            {playerEmojis[`player${currentPlayer}`].length === 3 && (
              <p className="warning">⚠️ Next emoji will replace your oldest emoji!</p>
            )}
            {firstEmojiPositions[`player${currentPlayer}`] !== null &&
              playerEmojis[`player${currentPlayer}`].length === 3 && (
                <p className="restriction">
                  🚫 Cannot place on cell {firstEmojiPositions[`player${currentPlayer}`] + 1}
                </p>
              )}
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
            className={`board-cell ${winningCells.includes(index) ? "winning" : ""} ${
              playerEmojis[`player${currentPlayer}`].length === 3 &&
              index === firstEmojiPositions[`player${currentPlayer}`]
                ? "restricted"
                : ""
            }`}
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
        <h4>Game Rules:</h4>
        <ul>
          <li>Get 3 in a row to win (horizontal, vertical, diagonal)</li>
          <li>Max 3 emojis per player on board at any time</li>
          <li>When placing 4th emoji, oldest emoji vanishes (FIFO)</li>
          <li>Cannot place 4th emoji where your 1st emoji was originally placed</li>
          <li>Random emoji assigned from your category each turn</li>
        </ul>
      </div>
    </div>
  )
}

export default GameBoard
