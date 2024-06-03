function generateEmptyBoard(size) {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

function isValid(board, row, col, num) {
    for (let x = 0; x < board.length; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
    }

    const sqrt = Math.sqrt(board.length);
    const startRow = row - row % sqrt;
    const startCol = col - col % sqrt;

    for (let r = startRow; r < startRow + sqrt; r++) {
        for (let d = startCol; d < startCol + sqrt; d++) {
            if (board[r][d] === num) return false;
        }
    }
    return true;
}

function fillBoard(board, size) {
    let row = -1;
    let col = -1;
    let isEmpty = true;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                row = i;
                col = j;
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) break;
    }
    if (isEmpty) return true;

    for (let num = 1; num <= size; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board, size)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

function hasUniqueSolution(board, size) {
    let solutions = 0;

    function solve() {
        let row = -1;
        let col = -1;
        let isEmpty = true;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    row = i;
                    col = j;
                    isEmpty = false;
                    break;
                }
            }
            if (!isEmpty) break;
        }
        if (isEmpty) {
            solutions++;
            return solutions === 1;
        }

        for (let num = 1; num <= size; num++) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solve()) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    solve();
    return solutions === 1;
}

function removeNumbers(board, size, complexity) {
    const attempts = complexity * size;
    let removedCells = 0;

    while (removedCells < attempts) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        if (board[row][col] !== 0) {
            const backup = board[row][col];
            board[row][col] = 0;

            // Check if the board still has a unique solution
            const boardCopy = JSON.parse(JSON.stringify(board));
            if (!hasUniqueSolution(boardCopy, size)) {
                board[row][col] = backup;
            } else {
                removedCells++;
            }
        }
    }
}

function generateSudoku(size = 9, complexity = 1) {
    if (size < 9 || !Number.isInteger(Math.sqrt(size))) {
        throw new Error('Invalid board size. Size must be a perfect square.');
    }
    
    const board = generateEmptyBoard(size);
    fillBoard(board, size);
    removeNumbers(board, size, complexity);
    return board;
}

module.exports = { generateSudoku };