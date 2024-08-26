const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let gameState = {
    players: { A: null, B: null },
    piecesSetup: { A: false, B: false },
    board: Array(5).fill(null).map(() => Array(5).fill(null)),
    currentPlayer: 'A'
};

//INITIALIZATION
wss.on('connection', function connection(ws) {
    if (!gameState.players.A) {
        gameState.players.A = ws;
        ws.send(JSON.stringify({ type: 'init', player: 'A' }));
    } else if (!gameState.players.B) {
        gameState.players.B = ws;
        ws.send(JSON.stringify({ type: 'init', player: 'B' }));
    } else {
        ws.close();
    }

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        if (data.type === 'setup') {
            handleSetup(ws, data.pieces);
        } else if (data.type === 'move') {
            handleMove(ws, data.move);
        }
    });

    ws.on('close', function close() {
        if (gameState.players.A === ws) gameState.players.A = null;
        if (gameState.players.B === ws) gameState.players.B = null;
    });
});

//SETUP BOARD
function handleSetup(ws, pieces) {
    const player = ws === gameState.players.A ? 'A' : 'B';
    const row = player === 'A' ? 0 : 4;

    pieces.forEach((piece, index) => {
        gameState.board[row][index] = `${player}-${piece}`;
    });

    gameState.piecesSetup[player] = true;

    if (gameState.piecesSetup.A && gameState.piecesSetup.B) {
        gameState.currentPlayer = 'A'; 
        broadcastGameState();
    }
}

//MOVES LOGIC
function handleMove(ws, move) {
    const player = ws === gameState.players.A ? 'A' : 'B';
    if (player !== gameState.currentPlayer) {
        ws.send(JSON.stringify({ type: 'error', message: 'Not your turn!' }));
        return;
    }

    const [piece, direction] = move.split(':');
    const [fromX, fromY] = findPiecePosition(`${player}-${piece}`);
    const [toX, toY] = calculateNewPosition(fromX, fromY, direction);

    if (isValidMove(fromX, fromY, toX, toY, piece, player)) {
        gameState.board[fromX][fromY] = null;
        gameState.board[toX][toY] = `${player}-${piece}`;
        gameState.currentPlayer = player === 'A' ? 'B' : 'A';
        broadcastGameState();
        checkForGameOver();
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid move!' }));
    }
}


//DISPLAY STATE
function broadcastGameState() {
    const message = JSON.stringify({ type: 'gameState', gameState });
    if (gameState.players.A) gameState.players.A.send(message);
    if (gameState.players.B) gameState.players.B.send(message);
}


//LOCATE PIECE
function findPiecePosition(piece) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (gameState.board[x][y] === piece) return [x, y];
        }
    }
    return [null, null];
}

//NEXT MOVE
function calculateNewPosition(x, y, direction) {
    switch (direction) {
        case 'L': return [x, y - 1];
        case 'R': return [x, y + 1];
        case 'F': return [x + 1, y];
        case 'B': return [x - 1, y];
        case 'FL': return [x + 2, y - 2];
        case 'FR': return [x + 2, y + 2];
        case 'BL': return [x - 2, y - 2];
        case 'BR': return [x - 2, y + 2];
        default: return [x, y];
    }
}


//CHECK MOVE IS VALID OR NOT
function isValidMove(fromX, fromY, toX, toY, piece, player) {
    if (toX < 0 || toX >= 5 || toY < 0 || toY >= 5) return false;
    if (gameState.board[toX][toY] && gameState.board[toX][toY][0] === player) return false;
    
    if (piece === 'P' || piece === 'H1') {
        //Pawn and Hero restrictions
        const dx = Math.abs(toX - fromX);
        const dy = Math.abs(toY - fromY);
        if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 2 && dy === 0) || (dx === 0 && dy === 2))) return false;
    } else if (piece === 'H2') {
        // Hero2 restriction
        const dx = Math.abs(toX - fromX);
        const dy = Math.abs(toY - fromY);
        if (!((dx === 2 && dy === 2))) return false;
    }
    return true;
}


//GAME OVER: WIN/DRAW
function checkForGameOver() {
    const remainingPieces = gameState.board.flat().filter(Boolean);
    const aPieces = remainingPieces.filter(piece => piece.startsWith('A')).length;
    const bPieces = remainingPieces.filter(piece => piece.startsWith('B')).length;

    if (aPieces === 0 || bPieces === 0) {
        const winner = aPieces > 0 ? 'A' : 'B';
        const message = JSON.stringify({ type: 'gameOver', winner });
        if (gameState.players.A) gameState.players.A.send(message);
        if (gameState.players.B) gameState.players.B.send(message);
    } else if (remainingPieces.length === 0) {
        const message = JSON.stringify({ type: 'gameOver', winner: 'Draw' });
        if (gameState.players.A) gameState.players.A.send(message);
        if (gameState.players.B) gameState.players.B.send(message);
    }
}
