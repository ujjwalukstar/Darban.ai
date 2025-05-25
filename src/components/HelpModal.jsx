"use client"

import "./HelpModal.css"

const HelpModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How to Play Blink Tac Toe</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="rule-section">
            <h3>🎯 Game Rules</h3>
            <ul>
              <li>The game is played on a 3x3 grid like regular Tic Tac Toe</li>
              <li>Each player selects an emoji category before the game begins</li>
              <li>On their turn, a player gets a random emoji from their category</li>
              <li>Players take turns placing their emoji on any empty cell</li>
            </ul>
          </div>

          <div className="rule-section">
            <h3>✨ Vanishing Rule (The Twist!)</h3>
            <ul>
              <li>Each player can have only 3 emojis on the board at any time</li>
              <li>When you place a 4th emoji, your oldest emoji vanishes (FIFO logic)</li>
              <li>You cannot place your 4th emoji where your 1st emoji was removed</li>
              <li>This creates a dynamic, ever-changing board!</li>
            </ul>
          </div>

          <div className="rule-section">
            <h3>🏆 Winning</h3>
            <ul>
              <li>Form a line of 3 of your emojis (horizontal, vertical, or diagonal)</li>
              <li>All 3 emojis must belong to you</li>
              <li>The game continues until someone wins</li>
              <li>Draws are impossible because emojis keep vanishing!</li>
            </ul>
          </div>

          <div className="rule-section">
            <h3>🎵 Sound Effects</h3>
            <ul>
              <li>🔊 Placement sound when you place an emoji</li>
              <li>💨 Vanish sound when an emoji disappears</li>
              <li>🎉 Victory sound when someone wins</li>
              <li>❌ Error sound for invalid moves</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpModal
