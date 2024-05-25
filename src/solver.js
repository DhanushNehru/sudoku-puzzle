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

function solveSudoku(board, size) {
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
            if (solveSudoku(board, size)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

module.exports = { solveSudoku };
