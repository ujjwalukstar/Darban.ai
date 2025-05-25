# Blink Tac Toe

A modern twist on the classic Tic Tac Toe game with vanishing emojis and category-based gameplay.

## How to Play

1. **Setup**: Each player chooses an emoji category (animals, food, sports, etc.)
2. **Gameplay**: Players take turns placing random emojis from their category
3. **Vanishing Rule**: Each player can only have 3 emojis on the board at once
4. **FIFO Logic**: When placing a 4th emoji, the oldest one disappears
5. **Restriction**: Can't place new emoji where your oldest just vanished
6. **Winning**: Get 3 of your emojis in a row (horizontal, vertical, or diagonal)

## Tech Stack

- React.js with Vite
- CSS3 for styling
- Web Audio API for sound effects

## Features

- 6 emoji categories with 8 emojis each
- Dynamic board that changes as emojis vanish
- Sound effects for game actions
- Score tracking across multiple rounds
- Responsive design for mobile and desktop
- Simple, clean UI

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Game Rules Explained

The "vanishing" mechanic is what makes this game unique:

- Traditional Tic Tac Toe allows 9 moves maximum
- Blink Tac Toe allows unlimited moves due to the vanishing rule
- Strategy involves managing your 3-emoji queue
- Creates dynamic gameplay where the board constantly changes
- No draws possible since emojis keep disappearing

This creates a more strategic and engaging experience than traditional Tic Tac Toe.
