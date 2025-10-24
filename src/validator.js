const { solveSudoku } = require('./solver');

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

function isBoardValid(board) {
    const size = board.length;
    if (![9, 16].includes(size)) return false;

    // 1. Check for basic rule violations (duplicates)
    for (let i = 0; i < size; i++) {
        const row = new Set();
        const col = new Set();
        const box = new Set();
        const sqrt = Math.sqrt(size);
        const boxRow = Math.floor(i / sqrt) * sqrt;
        const boxCol = (i % sqrt) * sqrt;

        for (let j = 0; j < size; j++) {
            // Check row
            const rowVal = board[i][j];
            if (rowVal !== 0) {
                if (row.has(rowVal)) return false;
                row.add(rowVal);
            }

            // Check column
            const colVal = board[j][i];
            if (colVal !== 0) {
                if (col.has(colVal)) return false;
                col.add(colVal);
            }

            // Check box
            const boxVal = board[boxRow + Math.floor(j / sqrt)][boxCol + (j % sqrt)];
            if (boxVal !== 0) {
                if (box.has(boxVal)) return false;
                box.add(boxVal);
            }
        }
    }

    // 2. Check if the board is solvable
    // A valid puzzle must have at least one solution.
    const boardCopy = board.map(row => row.slice());
    if (!solveSudoku(boardCopy, size)) {
        return false;
    }

    return true;
}

module.exports = { isBoardValid };
