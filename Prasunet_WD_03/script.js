const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const modeButton = document.getElementById('modeButton');
let currentPlayer = 'X';
const AI_PLAYER = 'O';
const HUMAN_PLAYER = 'X';
let isAIMode = false;
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGame();

restartButton.addEventListener('click', startGame);
modeButton.addEventListener('click', switchMode);

function startGame() {
    currentPlayer = HUMAN_PLAYER;
    cells.forEach(cell => {
        cell.classList.remove('X');
        cell.classList.remove('O');
        cell.textContent = '';  // Clear cell text content
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.textContent = '';
}

function handleClick(e) {
    const cell = e.target;
    placeMark(cell, currentPlayer);
    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (isAIMode && currentPlayer === AI_PLAYER) {
            bestMove();
        }
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageElement.textContent = "It's a Draw!";
    } else {
        winningMessageElement.textContent = `${currentPlayer} Wins!`;
    }
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('X') || cell.classList.contains('O');
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass;  // Set cell text content to the current player's mark
}

function swapTurns() {
    currentPlayer = currentPlayer === HUMAN_PLAYER ? AI_PLAYER : HUMAN_PLAYER;
}

function setBoardHoverClass() {
    board.classList.remove('X');
    board.classList.remove('O');
    board.classList.add(currentPlayer);
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function bestMove() {
    const bestSpot = minimax([...cells], AI_PLAYER).index;
    placeMark(cells[bestSpot], AI_PLAYER);
    cells[bestSpot].removeEventListener('click', handleClick);
    if (checkWin(AI_PLAYER)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function minimax(newBoard, player) {
    const availSpots = newBoard.filter(cell => !cell.classList.contains(HUMAN_PLAYER) && !cell.classList.contains(AI_PLAYER));

    if (checkWinner(newBoard, HUMAN_PLAYER)) {
        return { score: -10 };
    } else if (checkWinner(newBoard, AI_PLAYER)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = newBoard.indexOf(availSpots[i]);
        newBoard[move.index].classList.add(player);
        newBoard[move.index].textContent = player;  // Temporarily set cell text content for minimax

        if (player === AI_PLAYER) {
            const result = minimax(newBoard, HUMAN_PLAYER);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, AI_PLAYER);
            move.score = result.score;
        }

        newBoard[move.index].classList.remove(player);
        newBoard[move.index].textContent = '';  // Remove temporary text content for minimax
        moves.push(move);
    }

    let bestMove;
    if (player === AI_PLAYER) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinner(board, player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index].classList.contains(player);
        });
    });
}

function switchMode() {
    isAIMode = !isAIMode;
    modeButton.textContent = isAIMode ? 'Switch to 2-Player Mode' : 'Switch to AI Mode';
    startGame();
}
