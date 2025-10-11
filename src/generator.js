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

    // Shuffle numbers for more randomness
    const numbers = Array.from({ length: size }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    for (let num of numbers) {
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

// Enhanced difficulty system with more levels
const DIFFICULTY_LEVELS = {
    'beginner': { multiplier: 0.3, name: 'Beginner', description: 'Very easy, lots of given numbers' },
    'easy': { multiplier: 0.4, name: 'Easy', description: 'Easy level with good number of clues' },
    'medium': { multiplier: 0.5, name: 'Medium', description: 'Balanced difficulty' },
    'hard': { multiplier: 0.6, name: 'Hard', description: 'Challenging with fewer clues' },
    'expert': { multiplier: 0.7, name: 'Expert', description: 'Very challenging' },
    'master': { multiplier: 0.75, name: 'Master', description: 'Extremely difficult' },
    'extreme': { multiplier: 0.8, name: 'Extreme', description: 'For sudoku masters only' }
};

function removeNumbers(board, size, difficulty) {
    const difficultyConfig = DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS['medium'];
    const maxCellsToRemove = Math.floor(size * size * difficultyConfig.multiplier);
    let removedCells = 0;
    let attempts = 0;
    const maxAttempts = size * size * 2;

    while (removedCells < maxCellsToRemove && attempts < maxAttempts) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        attempts++;
        
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

function generateSudoku(size = 9, difficulty = 'medium') {
    
    // Support both old complexity numbers and new difficulty strings
    if (typeof difficulty === 'number') {
        const difficultyMap = ['beginner', 'easy', 'medium', 'hard', 'expert'];
        difficulty = difficultyMap[Math.min(difficulty - 1, 4)] || 'medium';
    }
    
    const board = generateEmptyBoard(size);
    fillBoard(board, size);
    removeNumbers(board, size, difficulty);
    return board;
}

function getDifficultyLevels() {
    return Object.keys(DIFFICULTY_LEVELS).map(key => ({
        key,
        ...DIFFICULTY_LEVELS[key]
    }));
}

module.exports = { generateSudoku, getDifficultyLevels };