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
        if (solutions > 1) {
            return;
        }

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
            return;
        }

        for (let num = 1; num <= size; num++) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                solve();
                board[row][col] = 0; // Backtrack
            }
        }
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
    // Ensure we do not remove too many cells, leaving at least the minimum number of clues
    function getMinimumClues(size) {
        // For 9x9, minimum is 17; for other sizes, use a conservative estimate (e.g., size*2)
        if (size === 9) return 17;
        // For 4x4, minimum is 4; for 16x16, use 40 as a conservative guess
        if (size === 4) return 4;
        if (size === 16) return 40;
        // Fallback: at least size*2 clues
        return Math.max(4, size * 2);
    }
    const minClues = getMinimumClues(size);
    let cellsToRemove = Math.floor(size * size * difficultyConfig.multiplier);
    // Adjust cellsToRemove if it would leave fewer than minClues
    if ((size * size - cellsToRemove) < minClues) {
        cellsToRemove = size * size - minClues;
    }
    let removedCount = 0;

    // Create a shuffled list of all cell coordinates to try removing them in a random order.
    // This is much more efficient than randomly picking cells with replacement.
    const cells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            cells.push({ r, c });
        }
    }
    for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    for (const cell of cells) {
        if (removedCount >= cellsToRemove) {
            break;
        }

        const { r, c } = cell;
        const backup = board[r][c];
        board[r][c] = 0;

        const boardCopy = JSON.parse(JSON.stringify(board));
        if (hasUniqueSolution(boardCopy, size)) {
            removedCount++;
        } else {
            // If removing the cell results in multiple solutions, restore it.
            board[r][c] = backup;
        }
    }
}

function generateSudoku(size = 9, difficulty = 'medium') {
    if (typeof size !== 'number' || size <= 0 || Math.sqrt(size) % 1 !== 0) {
        throw new Error('Invalid board size. Only perfect square sizes (e.g., 4, 9, 16, 25, ...) are supported.');
    }
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