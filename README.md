# BhaygeshaKhairnar_21BBS0220

# Turn-Based Chess-like Game

This repository contains a complete implementation of a turn-based chess-like game using WebSocket for real-time communication and a web-based user interface. The game features a 5x5 grid board, three types of characters (`Pawn`, `Hero1`, `Hero2`), and supports two-player gameplay.

## Features

- **Turn-based gameplay**: Players alternate turns.
- **Character types**: Pawn, Hero1, Hero2 with unique movement rules.
- **WebSocket communication**: Real-time updates and move handling.
- **Game board**: 5x5 grid with visual representation.
- **Move validation**: Checks for valid moves and game over conditions.
- **Responsive UI**: Displays game state, current player's turn, and move options.

## Installation and Setup

### Prerequisites

- **Node.js**: Make sure Node.js is installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

### Cloning the Repository

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/turn-based-chess-like-game.git
   cd turn-based-chess-like-game

2. **Install dependencies**:
    ```bash
    npm install
    
3. **Start the Websocket server**:
    ```bash
    node server.js
    
4. **Open the Client UI**:
   -Open 'index.html' in a web browser directly from your file system. (right click-open with-choose browser)
   -Open two tabs with the same steps.
   -Player A and Player B can now play live.

   
Usage
Setup:

Two players need to connect to the WebSocket server using separate instances of the web client.
Each player will place their pieces on their respective starting rows.
Playing the Game:

Players take turns moving their characters.
Click on a character to see available moves.
Select a move to execute it. The game state will be updated in real-time.
Game Over:

The game ends when one player has no pieces left.
The winner will be announced, and players can restart the game.
  
    

   
