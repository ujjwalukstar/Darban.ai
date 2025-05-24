"use client"

import "./Cell.css"

const Cell = ({ value, onClick, isWinning }) => {
  return (
    <div className={`cell ${isWinning ? "winning" : ""} ${value ? "filled" : "empty"}`} onClick={onClick}>
      {value}
    </div>
  )
}

export default Cell
