"use client"

import { useState, useEffect } from "react"
import Board from "./Board"
import { getRandomEmoji } from "../utils/emojiUtils"
import { playSound } from "../utils/soundUtils"
import "./Game.css"

const Game = ({ player1Category, player2Category, onResetGame, onUpdateScore, soundEnabled }) => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [player1Emojis, setPlayer1Emojis] = useState([])
  const [player2Emojis, setPlayer2Emojis] = useState([])
  const [player1Positions, setPlayer1Positions] = useState([])
  const [player2Positions, setPlayer2Positions] = useState([])
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState([])
  const [currentEmoji, setCurrentEmoji] = useState("")

  useEffect(() => {
    setCurrentEmoji(getRandomEmoji(player1Category))
  }, [player1Category])

  const handleCellClick = (index) => {
    if (board[index] !== null || winner) return

    // Check if the cell was previously occupied by the player's first emoji (which was removed)
    if (currentPlayer === 1 && player1Emojis.length === 3) {
      if (index === player1Positions[0]) {
        if (soundEnabled) playSound("error")
        return
      }
    } else if (currentPlayer === 2 && player2Emojis.length === 3) {
      if (index === player2Positions[0]) {
        if (soundEnabled) playSound("error")
        return
      }
    }

    // Play placement sound
    if (soundEnabled) playSound("place")

    const newBoard = [...board]
    newBoard[index] = currentEmoji

    // Update player's emojis and positions
    if (currentPlayer === 1) {
      const newEmojis = [...player1Emojis, currentEmoji]
      const newPositions = [...player1Positions, index]

      // Apply vanishing rule if player has more than 3 emojis
      if (newEmojis.length > 3) {
        newEmojis.shift() // Remove oldest emoji
        const oldestPosition = newPositions.shift() // Get and remove oldest position
        newBoard[oldestPosition] = null // Clear the cell on the board
        if (soundEnabled) playSound("vanish")
      }

      setPlayer1Emojis(newEmojis)
      setPlayer1Positions(newPositions)
    } else {
      const newEmojis = [...player2Emojis, currentEmoji]
      const newPositions = [...player2Positions, index]

      if (newEmojis.length > 3) {
        newEmojis.shift()
        const oldestPosition = newPositions.shift()
        newBoard[oldestPosition] = null
        if (soundEnabled) playSound("vanish")
      }

      setPlayer2Emojis(newEmojis)
      setPlayer2Positions(newPositions)
    }

    setBoard(newBoard)

    // Check for winner
    const winResult = checkWinner(newBoard)
    if (winResult) {
      setWinner(currentPlayer)
      setWinningLine(winResult)
      onUpdateScore(currentPlayer)
      if (soundEnabled) playSound("win")
    } else {
      // Switch player and set new random emoji
      const nextPlayer = currentPlayer === 1 ? 2 : 1
      setCurrentPlayer(nextPlayer)
      setCurrentEmoji(getRandomEmoji(nextPlayer === 1 ? player1Category : player2Category))
    }
  }

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Vertical
      [0, 4, 8],
      [2, 4, 6], // Diagonal
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (board[a] && board[b] && board[c]) {
        const belongsToPlayer1 =
          player1Emojis.includes(board[a]) && player1Emojis.includes(board[b]) && player1Emojis.includes(board[c])

        const belongsToPlayer2 =
          player2Emojis.includes(board[a]) && player2Emojis.includes(board[b]) && player2Emojis.includes(board[c])

        if (belongsToPlayer1 || belongsToPlayer2) {
          return lines[i]
        }
      }
    }
    return null
  }

  const playAgain = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer(1)
    setPlayer1Emojis([])
    setPlayer2Emojis([])
    setPlayer1Positions([])
    setPlayer2Positions([])
    setWinner(null)
    setWinningLine([])
    setCurrentEmoji(getRandomEmoji(player1Category))
    if (soundEnabled) playSound("newGame")
  }

  return (
    <div className="game-container">
      {!winner ? (
        <div className="turn-indicator">
          <div className="current-player">Player {currentPlayer}'s Turn</div>
          <div className="current-emoji">{currentEmoji}</div>
          <div className="emoji-count">
            Emojis on board: {currentPlayer === 1 ? player1Emojis.length : player2Emojis.length}/3
          </div>
        </div>
      ) : (
        <div className="winner-announcement">
          <div className="winner-text">🎉 Player {winner} Wins! 🎉</div>
        </div>
      )}

      <Board board={board} onCellClick={handleCellClick} winningLine={winningLine} />

      <div className="game-controls">
        {winner && (
          <button className="play-again-btn" onClick={playAgain}>
            🔄 Play Again
          </button>
        )}
        <button className="new-game-btn" onClick={onResetGame}>
          🆕 New Game
        </button>
      </div>
    </div>
  )
}

export default Game
