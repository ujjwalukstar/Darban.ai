"use client"

import Cell from "./Cell"
import "./Board.css"

const Board = ({ board, onCellClick, winningLine }) => {
  return (
    <div className="board">
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onClick={() => onCellClick(index)}
          isWinning={winningLine && winningLine.includes(index)}
        />
      ))}
    </div>
  )
}

export default Board
