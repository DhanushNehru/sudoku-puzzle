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
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] !== 0) {
                const num = board[row][col];
                board[row][col] = 0;
                if (!isValid(board, row, col, num)) return false;
                board[row][col] = num;
            }
        }
    }
    return true;
}

module.exports = { isBoardValid };
